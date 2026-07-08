-- LGRBZ v2.0 starter RLS policies

alter table portfolios enable row level security;
alter table portfolio_transactions enable row level security;

create policy "Users can view their own portfolios"
on portfolios for select
using (auth.uid() = user_id);

create policy "Users can insert their own portfolios"
on portfolios for insert
with check (auth.uid() = user_id);

create policy "Users can view transactions for own portfolios"
on portfolio_transactions for select
using (
  exists (
    select 1
    from portfolios
    where portfolios.id = portfolio_transactions.portfolio_id
    and portfolios.user_id = auth.uid()
  )
);

create policy "Users can insert transactions for own portfolios"
on portfolio_transactions for insert
with check (
  exists (
    select 1
    from portfolios
    where portfolios.id = portfolio_transactions.portfolio_id
    and portfolios.user_id = auth.uid()
  )
);
