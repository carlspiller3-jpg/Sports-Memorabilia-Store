-- Create product_waitlist table
create table public.product_waitlist (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  email text not null,
  product_handle text not null,
  variant_id uuid null,
  status text not null default 'pending'::text,
  auto_charge_enabled boolean not null default false,
  payment_method_token text null,
  notification_sent_at timestamp with time zone null,
  constraint product_waitlist_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.product_waitlist enable row level security;

-- Allow public inserts (anyone can join the waitlist)
create policy "Allow public insert on product_waitlist" 
  on public.product_waitlist
  for insert 
  with check (true);

-- Allow authenticated users (Admins) all access
create policy "Allow authenticated all on product_waitlist" 
  on public.product_waitlist
  for all 
  to authenticated 
  using (true) 
  with check (true);
