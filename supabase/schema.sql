-- AI UMKM Co-Pilot Database Schema
-- Initial MVP schema for Supabase PostgreSQL

create extension if not exists "pgcrypto";

-- =========================================================
-- Updated At Trigger Function
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  business_type text not null,
  currency text not null default 'IDR',
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  description text,
  transaction_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  sku text,
  cost_price numeric(14, 2) not null default 0 check (cost_price >= 0),
  selling_price numeric(14, 2) not null default 0 check (selling_price >= 0),
  current_stock integer not null default 0 check (current_stock >= 0),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity integer not null check (quantity > 0),
  note text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Updated At Triggers
-- =========================================================

drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
before update on public.businesses
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- =========================================================
-- Indexes
-- =========================================================

create index if not exists idx_businesses_owner_id
on public.businesses(owner_id);

create index if not exists idx_categories_business_id
on public.categories(business_id);

create index if not exists idx_categories_type
on public.categories(type);

create index if not exists idx_transactions_business_id
on public.transactions(business_id);

create index if not exists idx_transactions_type
on public.transactions(type);

create index if not exists idx_transactions_transaction_date
on public.transactions(transaction_date);

create index if not exists idx_transactions_business_date
on public.transactions(business_id, transaction_date);

create index if not exists idx_products_business_id
on public.products(business_id);

create index if not exists idx_products_low_stock
on public.products(business_id, current_stock, minimum_stock);

create index if not exists idx_stock_movements_business_id
on public.stock_movements(business_id);

create index if not exists idx_stock_movements_product_id
on public.stock_movements(product_id);

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;

-- =========================================================
-- Helper Ownership Logic
-- =========================================================
-- Policy rule:
-- A user can access a row if the related business belongs to auth.uid().

-- =========================================================
-- Businesses Policies
-- =========================================================

drop policy if exists "Users can view their own businesses" on public.businesses;
create policy "Users can view their own businesses"
on public.businesses
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create their own businesses" on public.businesses;
create policy "Users can create their own businesses"
on public.businesses
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their own businesses" on public.businesses;
create policy "Users can update their own businesses"
on public.businesses
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete their own businesses" on public.businesses;
create policy "Users can delete their own businesses"
on public.businesses
for delete
to authenticated
using ((select auth.uid()) = owner_id);

-- =========================================================
-- Categories Policies
-- =========================================================

drop policy if exists "Users can view categories from their businesses" on public.categories;
create policy "Users can view categories from their businesses"
on public.categories
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can create categories for their businesses" on public.categories;
create policy "Users can create categories for their businesses"
on public.categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can update categories from their businesses" on public.categories;
create policy "Users can update categories from their businesses"
on public.categories
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete categories from their businesses" on public.categories;
create policy "Users can delete categories from their businesses"
on public.categories
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.owner_id = (select auth.uid())
  )
);

-- =========================================================
-- Transactions Policies
-- =========================================================

drop policy if exists "Users can view transactions from their businesses" on public.transactions;
create policy "Users can view transactions from their businesses"
on public.transactions
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can create transactions for their businesses" on public.transactions;
create policy "Users can create transactions for their businesses"
on public.transactions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can update transactions from their businesses" on public.transactions;
create policy "Users can update transactions from their businesses"
on public.transactions
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete transactions from their businesses" on public.transactions;
create policy "Users can delete transactions from their businesses"
on public.transactions
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.owner_id = (select auth.uid())
  )
);

-- =========================================================
-- Products Policies
-- =========================================================

drop policy if exists "Users can view products from their businesses" on public.products;
create policy "Users can view products from their businesses"
on public.products
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = products.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can create products for their businesses" on public.products;
create policy "Users can create products for their businesses"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = products.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can update products from their businesses" on public.products;
create policy "Users can update products from their businesses"
on public.products
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = products.business_id
      and b.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = products.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete products from their businesses" on public.products;
create policy "Users can delete products from their businesses"
on public.products
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = products.business_id
      and b.owner_id = (select auth.uid())
  )
);

-- =========================================================
-- Stock Movements Policies
-- =========================================================

drop policy if exists "Users can view stock movements from their businesses" on public.stock_movements;
create policy "Users can view stock movements from their businesses"
on public.stock_movements
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = stock_movements.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can create stock movements for their businesses" on public.stock_movements;
create policy "Users can create stock movements for their businesses"
on public.stock_movements
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = stock_movements.business_id
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete stock movements from their businesses" on public.stock_movements;
create policy "Users can delete stock movements from their businesses"
on public.stock_movements
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = stock_movements.business_id
      and b.owner_id = (select auth.uid())
  )
);