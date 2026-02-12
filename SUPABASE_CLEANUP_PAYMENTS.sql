
-- Remove Payment columns from product_waitlist to remove liability
alter table public.product_waitlist 
drop column if exists payment_method_token,
drop column if exists auto_charge_enabled,
drop column if exists billing_name;
