
-- Add Payment columns to product_waitlist
alter table public.product_waitlist 
add column if not exists payment_method_token text, -- Stores Stripe Method ID (or mock)
add column if not exists auto_charge_enabled boolean default false,
add column if not exists billing_name text;

-- Create index for auto-charge queries
create index if not exists product_waitlist_autocharge_idx on public.product_waitlist(status, auto_charge_enabled);
