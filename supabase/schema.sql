-- ==============================================================================
-- Smart Expense Tracking — Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================
-- Execute this entire file in your Supabase Project -> SQL Editor to initialize the database.

-- 1. Create expenses table
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(10, 2) not null check (amount > 0),
  category text not null,
  expense_date date not null default current_date,
  notes text,
  payment_method text default 'UPI',
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 2. Create monthly_budgets table
create table if not exists public.monthly_budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  category text not null default 'OVERALL',
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint unique_user_month_category unique (user_id, month_start, category)
);

-- 3. Create high-efficiency performance indexes
create index if not exists idx_expenses_user_date 
  on public.expenses (user_id, expense_date desc);

create index if not exists idx_expenses_category 
  on public.expenses (user_id, category);

create index if not exists idx_monthly_budgets_lookup 
  on public.monthly_budgets (user_id, month_start, category);

-- 4. Enable Row Level Security (RLS)
alter table public.expenses enable row level security;
alter table public.monthly_budgets enable row level security;

-- 5. Strict RLS Policies for expenses table
drop policy if exists "Users can read own expenses" on public.expenses;
create policy "Users can read own expenses" 
  on public.expenses for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own expenses" on public.expenses;
create policy "Users can insert own expenses" 
  on public.expenses for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own expenses" on public.expenses;
create policy "Users can update own expenses" 
  on public.expenses for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own expenses" on public.expenses;
create policy "Users can delete own expenses" 
  on public.expenses for delete 
  using (auth.uid() = user_id);

-- 6. Strict RLS Policies for monthly_budgets table
drop policy if exists "Users can read own budgets" on public.monthly_budgets;
create policy "Users can read own budgets" 
  on public.monthly_budgets for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own budgets" on public.monthly_budgets;
create policy "Users can insert own budgets" 
  on public.monthly_budgets for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own budgets" on public.monthly_budgets;
create policy "Users can update own budgets" 
  on public.monthly_budgets for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own budgets" on public.monthly_budgets;
create policy "Users can delete own budgets" 
  on public.monthly_budgets for delete 
  using (auth.uid() = user_id);
