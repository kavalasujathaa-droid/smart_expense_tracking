<<<<<<< HEAD
# Smart Expense Tracking

> Precision dark-themed student expense tracking and budget intelligence application inspired by the **Powder** design system ([powder.framer.website](https://powder.framer.website/)). Built with **React 19**, **Vite**, **Vanilla CSS**, **Framer Motion**, **Recharts**, and **Supabase PostgreSQL** with strict **Row Level Security (RLS)**.

---

## 1. Project Overview

**Smart Expense Tracking** is designed specifically for college students to log daily campus expenses (canteen snacks, hostel rent, textbooks, transit fares, exam fees) in under 5 seconds. It features:

- **Obsidian Dark Aesthetic:** Inspired by Powder, featuring deep `#000000` canvas surfaces, floating pill navigation, subtle atmospheric glows, and `1080px` container layout.
- **Real Financial Analytics:** Category-wise spending donut chart, chronological spending trajectory, average daily burn rate, and top-expense category detection derived exclusively from authenticated user data.
- **Budget Intelligence & Guardrails:** Monthly overall allowance and per-category target caps with four-tier health indicators:
  - 🟢 **Safe Tier (<75%):** Normal pace, emerald progress bar.
  - 🟡 **Caution Tier (75%–90%):** Amber pacing alert calculating safe daily spend.
  - 🔴 **Critical Alert (90%–100%):** Rose alert banner for imminent budget exhaustion.
  - ⚠️ **Cap Exceeded (>100%):** Prominent overspend warning detailing exact rupees exceeded.
- **Strict Data Integrity:** Zero fake, mock, seeded, or hardcoded financial data. New accounts start completely clean.
- **One-Click CSV Export:** Structured ledger export formatted for parents, scholarship accounting, or student loans.

---

## 2. Technology Stack

- **Frontend Core:** React 19 (`react`, `react-dom`) + JavaScript (ES Modules)
- **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Styling System:** Vanilla CSS (`src/index.css`) with CSS custom properties, glassmorphism tokens, and responsive utility layouts
- **Motion & Transitions:** Framer Motion (`framer-motion`)
- **Iconography:** Lucide React (`lucide-react`)
- **Visual Analytics:** Recharts 3 (`recharts`)
- **Backend & Database:** Supabase (`@supabase/supabase-js`) + PostgreSQL with Row Level Security (RLS)
- **Linter & Static Analysis:** Oxlint (`oxlint`)

---

## 3. Local Setup Instructions

### Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node.js `v24`)
- npm `v9+` or `v10+`

### Installation
1. Clone or download the repository into your local directory.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment configuration:
   ```bash
   cp .env.example .env.local
   ```

4. Populate `.env.local` with your Supabase credentials (see [Environment Variables](#4-environment-variables) below).

5. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 4. Environment Variables

Create a file named `.env.local` in the project root:

```ini
# Supabase Project Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

> **Security Rule:** Never place secret service-role keys in `.env.local` or client-side files. `.env.local` is strictly ignored by Git in `.gitignore`.

---

## 5. Supabase SQL Database Setup

To initialize the PostgreSQL database schema and configure Row Level Security:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to the **SQL Editor**.
3. Copy and run the entire SQL script from [`supabase/schema.sql`](supabase/schema.sql):

```sql
-- Creates public.expenses table
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

-- Creates public.monthly_budgets table
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

-- Enables Row Level Security
alter table public.expenses enable row level security;
alter table public.monthly_budgets enable row level security;

-- Applies strict per-user RLS policies (SELECT, INSERT, UPDATE, DELETE)
create policy "Users can read own expenses" on public.expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on public.expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on public.expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on public.expenses for delete using (auth.uid() = user_id);

create policy "Users can read own budgets" on public.monthly_budgets for select using (auth.uid() = user_id);
create policy "Users can insert own budgets" on public.monthly_budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own budgets" on public.monthly_budgets for update using (auth.uid() = user_id);
create policy "Users can delete own budgets" on public.monthly_budgets for delete using (auth.uid() = user_id);
```

---

## 6. Database Security Notes

- **Row Level Security (RLS):** Both `public.expenses` and `public.monthly_budgets` have RLS actively enabled. Direct database queries will automatically reject any attempt to read, edit, or delete another student's records.
- **Client Key Scoping:** The client SDK connects using the Supabase **Publishable (anon) key**. This key only has access to operations permitted by RLS policies for the authenticated JWT token.
- **Input Validation:** Numeric amounts are checked server-side (`amount > 0`). Titles and categories are required.

---

## 7. Development and Build Commands

```bash
# Start development server with network exposure
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview

# Run Oxlint static analysis
npm run lint

# Run automated logic & boundary test suite
node src/lib/verify_logic.mjs
```

---

## 8. Testing Instructions

- **Automated Math & Threshold Suite:**
  ```bash
  node src/lib/verify_logic.mjs
  ```
  Validates division-by-zero protection, empty database handling, 75% caution, 90% critical, and >100% overspend calculations, plus multi-month boundary isolation.
- **Production Build Integrity:**
  ```bash
  npm run build
  ```
  Ensures the application compiles with zero errors.
- **User Authentication Flow:**
  Open `http://localhost:5173/`, tap **Get Started**, sign up with email and password, log in, add expenses, adjust budget caps, and verify persistence across browser refreshes.

---

## 9. Current Limitations & Next Steps

1. **Remote SQL Table Creation:** If you have just created a fresh Supabase project, you must execute `supabase/schema.sql` in the Supabase SQL Editor once before adding records.
2. **Cloud Deployment:** Deployment to production hosting (e.g. Vercel) is scheduled for subsequent release phases.
3. **Offline Sync:** Currently requires internet access to synchronize with Supabase PostgreSQL.
=======
# smart_expense_tracking
Full-stack expense management platform built with React, Vite, JavaScript, Supabase, and PostgreSQL. Features secure authentication, RLS, expense CRUD, budget tracking, custom categorization, data-driven analytics, interactive Recharts visualizations, and responsive glassmorphism UI with Framer Motion animations.
>>>>>>> e1ddfdfc313512040440aa103af0c9c0fea8b9f4
