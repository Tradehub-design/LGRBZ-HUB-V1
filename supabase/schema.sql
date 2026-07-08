-- LGRBZ v2.0 starter schema

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  currency text not null default 'AUD',
  created_at timestamptz not null default now()
);

create table if not exists portfolio_transactions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references portfolios(id) on delete cascade,
  transaction_date date not null,
  action text not null,
  ticker text not null,
  quantity numeric default 0,
  price numeric default 0,
  fees numeric default 0,
  currency text default 'AUD',
  platform text,
  notes text,
  created_at timestamptz not null default now()
);
