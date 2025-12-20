
-- Create a table for Waitlist Subscribers
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  interest text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(email)
);

-- Enable Row Level Security (RLS)
alter table public.newsletter_subscribers enable row level security;

-- Allow ANYONE to insert (sign up)
create policy "Allow public insert"
  on public.newsletter_subscribers
  for insert
  with check (true);

-- Allow NO ONE to read (privacy) - Only Service Role or Dashboard can read
create policy "Read access restricted"
  on public.newsletter_subscribers
  for select
  using (false);
