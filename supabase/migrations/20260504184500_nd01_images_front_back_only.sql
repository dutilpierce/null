-- ND_01: keep only front/back images in product gallery.
-- The app now renders only the first two images, but this keeps the database seed aligned as well.

do $$
declare
  v_product_id uuid;
begin
  select id into v_product_id from public.products where slug = 'nd-01-base-error-tee';
  if v_product_id is null then
    return;
  end if;

  delete from public.product_images
  where product_id = v_product_id
    and image_url in ('/products/nd01-neck.png', '/products/nd01-hem.png');

  -- Normalize sort_order to [0, 1] for the remaining images if present.
  update public.product_images set sort_order = 0
  where product_id = v_product_id and image_url = '/products/nd01-front.png';

  update public.product_images set sort_order = 1
  where product_id = v_product_id and image_url = '/products/nd01-back.png';
end $$;

