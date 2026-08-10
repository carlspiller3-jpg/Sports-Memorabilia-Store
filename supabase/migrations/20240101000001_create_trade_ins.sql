-- Create trade_ins table
create table if not exists trade_ins (
    id uuid default gen_random_uuid() primary key,
    user_id text,
    -- null if guest, or auth.uid() if we had auth
    customer_email text not null,
    item_description text not null,
    condition text not null,
    images text [],
    -- Array of image URLs (uploaded to storage)
    status text default 'pending',
    -- pending, reviewed, accepted, rejected
    created_at timestamp with time zone default now()
);
-- Enable RLS
alter table trade_ins enable row level security;
-- Create policies
create policy "Anyone can insert trade_ins" on trade_ins for
insert with check (true);
create policy "Users can see their own trade_ins" on trade_ins for
select using (customer_email = current_user);
-- Simplified for now, really depends on auth setup