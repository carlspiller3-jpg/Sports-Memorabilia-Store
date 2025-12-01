-- Create products table
create table public.products (
  id uuid not null default gen_random_uuid (),
  title text not null,
  body_html text null,
  vendor text null,
  product_type text null,
  handle text not null,
  status text not null default 'active'::text,
  tags text[] null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint products_pkey primary key (id),
  constraint products_handle_key unique (handle)
);

-- Create variants table
create table public.variants (
  id uuid not null default gen_random_uuid (),
  product_id uuid not null,
  title text not null,
  price numeric not null,
  sku text null,
  inventory_quantity integer not null default 0,
  option1 text null,
  option2 text null,
  smart_contract_address text null,
  token_id text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint variants_pkey primary key (id),
  constraint variants_product_id_fkey foreign key (product_id) references products (id) on delete cascade
);

-- Create options table
create table public.options (
  id uuid not null default gen_random_uuid (),
  product_id uuid not null,
  name text not null,
  position integer not null,
  values text[] not null,
  constraint options_pkey primary key (id),
  constraint options_product_id_fkey foreign key (product_id) references products (id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.options enable row level security;

-- Create policies for public read access
create policy "Allow public read access on products" on public.products for select using (true);
create policy "Allow public read access on variants" on public.variants for select using (true);
create policy "Allow public read access on options" on public.options for select using (true);
