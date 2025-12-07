-- Create reviews table
create table if not exists reviews (
    id uuid default gen_random_uuid() primary key,
    product_handle text not null,
    rating int not null check (
        rating >= 1
        and rating <= 5
    ),
    author_name text not null,
    title text,
    body text,
    created_at timestamp with time zone default now(),
    verified boolean default false
);
-- Enable RLS
alter table reviews enable row level security;
-- Create policies
create policy "Reviews are viewable by everyone" on reviews for
select using (true);
create policy "Anyone can insert reviews" on reviews for
insert with check (true);