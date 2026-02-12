
-- Create a table for Product Waitlist
create table if not exists public.product_waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  product_handle text not null,
  variant_id text, -- Specific variant (e.g. Framed)
  status text default 'pending', -- pending, notified, paid, completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notification_sent_at timestamp with time zone
);

-- Enable RLS
alter table public.product_waitlist enable row level security;

-- Allow public to insert (User joining waitlist)
create policy "Allow public insert waitlist"
  on public.product_waitlist
  for insert
  with check (true);

-- Allow admins (service role) to read/update
create policy "Allow internal read waitlist"
  on public.product_waitlist
  for select
  using (false); -- Adjust if you have authenticated admin users

-- Add 'restock_date' to variants table to support the automation
-- This allows the admin to set when the item is coming back
alter table public.variants 
add column if not exists restock_date timestamp with time zone;

-- Create an index for faster queries on pending notifications
create index if not exists product_waitlist_status_idx on public.product_waitlist(status);
create index if not exists product_waitlist_handle_idx on public.product_waitlist(product_handle);
