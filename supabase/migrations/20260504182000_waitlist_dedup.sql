-- Waitlist hardening:
-- - prevent duplicate signups for the same email (case-insensitive)
-- This keeps the API idempotent and reduces spam without changing app behavior.

create unique index if not exists waitlist_email_lower_unique on public.waitlist (lower(email));

