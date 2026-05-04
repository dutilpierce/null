-- Harden checkout RPC to match app expectations.
-- Key goals:
-- - Keep idempotency via orders.stripe_session_id uniqueness.
-- - Serialize inventory decrement with FOR UPDATE + guarded update.
-- - Reject invalid size early (avoid raising from constraint violations).
-- - Refuse to fulfill inactive / non-active products (refund handled by webhook).
-- - Never allow inventory to go negative (also enforced by table constraints).

create or replace function public.process_checkout_session(
  p_stripe_session_id text,
  p_product_id uuid,
  p_email text,
  p_size text,
  p_amount_total integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product public.products%rowtype;
  v_remaining int;
  v_order_id uuid;
begin
  -- Basic payload validation (keeps the function robust against webhook metadata tampering).
  if p_stripe_session_id is null or length(trim(p_stripe_session_id)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'invalid_session_id');
  end if;
  if p_email is null or length(trim(p_email)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'invalid_email');
  end if;
  if p_amount_total is null or p_amount_total < 0 then
    return jsonb_build_object('ok', false, 'error', 'invalid_amount_total');
  end if;
  if p_size is null or p_size not in ('S', 'M', 'L', 'XL', 'XXL') then
    return jsonb_build_object('ok', false, 'error', 'invalid_size');
  end if;

  -- Serialize per-product processing to prevent oversell.
  select * into v_product
  from public.products
  where id = p_product_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'product_not_found');
  end if;

  -- If a product is not currently eligible for purchase, refuse fulfillment.
  -- This is intentionally strict: if a product was deactivated between checkout creation and webhook receipt,
  -- the safe fallback path is to refund the payment intent (handled in the webhook).
  if v_product.active is not true or v_product.status <> 'active' then
    return jsonb_build_object('ok', false, 'error', 'product_inactive');
  end if;

  -- Idempotency barrier: do not process the same Stripe Session twice.
  insert into public.orders (stripe_session_id, product_id, email, size, amount_total, status)
  values (p_stripe_session_id, p_product_id, lower(trim(p_email)), p_size, p_amount_total, 'paid')
  on conflict (stripe_session_id) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    if exists (select 1 from public.orders where stripe_session_id = p_stripe_session_id) then
      return jsonb_build_object('ok', true, 'duplicate', true);
    end if;
    return jsonb_build_object('ok', false, 'error', 'order_insert_failed');
  end if;

  -- Sold out: rollback the order and return a soft error so the webhook can refund.
  if v_product.units_sold >= v_product.total_inventory then
    delete from public.orders where stripe_session_id = p_stripe_session_id;
    return jsonb_build_object('ok', false, 'error', 'sold_out');
  end if;

  -- Atomic inventory decrement with a guard to prevent going negative or exceeding the cap.
  update public.products
  set
    units_sold = units_sold + 1,
    updated_at = now(),
    status = case
      when units_sold + 1 >= total_inventory then 'sold_out'
      else status
    end,
    active = case
      when units_sold + 1 >= total_inventory then false
      else active
    end
  where id = p_product_id
    and units_sold < total_inventory;

  if not found then
    -- Another worker consumed the last unit while this function was executing.
    delete from public.orders where stripe_session_id = p_stripe_session_id;
    return jsonb_build_object('ok', false, 'error', 'inventory_race');
  end if;

  select total_inventory - units_sold into v_remaining from public.products where id = p_product_id;

  insert into public.inventory_events (product_id, event_type, event_note)
  values (
    p_product_id,
    'sale',
    format('stripe_session=%s remaining=%s', p_stripe_session_id, coalesce(v_remaining::text, '?'))
  );

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'remaining', v_remaining,
    'product_status', (select status from public.products where id = p_product_id)
  );
end;
$$;

revoke all on function public.process_checkout_session(text, uuid, text, text, integer) from public;
grant execute on function public.process_checkout_session(text, uuid, text, text, integer) to service_role;

