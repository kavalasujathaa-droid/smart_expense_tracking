// src/data/siteContent.js
// Legitimate product content and structural metadata for Smart Expense Tracking
// Contains zero mock transactions, zero fabricated balances, and zero fictional user profiles.

export const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Instant Log & Tag",
    subtitle: "Under 5 Seconds",
    description: "Capture daily canteen meals, metro fares, or course textbook expenses right at the counter with fast keyboard navigation.",
    icon: "Zap",
    tag: "Fast Input",
  },
  {
    number: "02",
    title: "Smart Categorization",
    subtitle: "Built for Campus Life",
    description: "Organized campus categories: Mess & Dining, Hostel & Rent, Books & Study, Transit, Tech & Utilities, and Exam Fees.",
    icon: "Layers",
    tag: "Campus Taxonomy",
  },
  {
    number: "03",
    title: "Guardrail Budget Limits",
    subtitle: "Multi-Tier Warnings",
    description: "Set monthly pocket money allowances and per-category caps. Visual indicators shift from emerald to amber and rose before you run out.",
    icon: "ShieldAlert",
    tag: "Allowance Protection",
  },
  {
    number: "04",
    title: "Real Spending Analytics",
    subtitle: "PostgreSQL & Recharts",
    description: "Interactive category distribution donut and chronological trajectory bar charts reveal your actual financial patterns upon login.",
    icon: "PieChart",
    tag: "Real Insights",
  },
];

export const FEATURE_GRID = [
  {
    title: "Quick Expense Logging",
    description: "Designed for rapid entry on mobile between lectures. Enter amount in INR, select a category, and save with zero lag.",
    badge: "Speed First",
    icon: "PlusCircle",
  },
  {
    title: "Instant Search & Date Filters",
    description: "Filter all expenses by exam week, semester month, or canteen dining costs with instant client-side search.",
    badge: "Deep Search",
    icon: "Filter",
  },
  {
    title: "Pocket Money Budget Caps",
    description: "Divide your monthly allowance into realistic buckets. Receive gentle alerts at 75% and 90% before dipping into emergency funds.",
    badge: "Smart Caps",
    icon: "Target",
  },
  {
    title: "Zero Spreadsheets Needed",
    description: "Say goodbye to clunky Excel sheets that you forget to update. Enjoy automated monthly rollups and remaining balances.",
    badge: "Automated",
    icon: "LayoutDashboard",
  },
  {
    title: "Row Level Security (RLS)",
    description: "Your financial records are strictly isolated in PostgreSQL with Supabase Row Level Security. Only you can view or modify your data.",
    badge: "Private & Safe",
    icon: "Lock",
  },
  {
    title: "Export to CSV & Sheets",
    description: "One-click export for scholarship reporting, internship stipend reconciliations, or sharing summaries with parents.",
    badge: "Data Ownership",
    icon: "DownloadCloud",
  },
];

export const PRODUCT_GUARANTEES = [
  {
    badge: "Security",
    title: "PostgreSQL RLS Isolation",
    detail: "Every record is protected by database-level Row Level Security policies. No cross-account data leaks.",
  },
  {
    badge: "Authenticity",
    title: "Zero Fabricated Data",
    detail: "New user ledgers start completely clean. All charts and metrics reflect only your genuine transactions.",
  },
  {
    badge: "Accessibility",
    title: "100% Free For Students",
    detail: "No paywalls on essential budget tracking, unlimited transactions, and export features.",
  },
  {
    badge: "Privacy",
    title: "Zero Ads & Zero Bank Logins",
    detail: "No loan banners, credit card spam, or affiliate promotions cluttering your dashboard.",
  },
];

export const STUDENT_INSIGHTS = [
  { stat: "100%", label: "User Data Ownership", detail: "Personal financial records belong only to your authenticated Supabase account." },
  { stat: "0ms", label: "Demo Fallbacks", detail: "Real PostgreSQL database states without deceptive mock substitutions." },
  { stat: "INR", label: "Native Currency", detail: "Tailored for Indian college expenses including mess fees and canteen UPI." },
  { stat: "RLS", label: "Row Level Security", detail: "Database engine guarantees unauthenticated requests are rejected." },
];

export const PRICING_PLANS = [
  {
    name: "Student Free",
    tagline: "Everything you need to control your monthly student allowance.",
    price: "₹0",
    frequency: "forever free",
    highlight: true,
    badge: "Full Access",
    features: [
      "Unlimited expense logging",
      "All student categories & custom notes",
      "Monthly allowance budget caps",
      "Per-category spending limits",
      "Multi-tier overspend warnings (75%, 90%, 100%+)",
      "Interactive category donut & trend charts",
      "Fast search and multi-filter controls",
      "Clean CSV data export",
      "Mobile-optimized responsive dashboard",
    ],
    ctaText: "Start Tracking Free",
    secondaryText: "No credit card required • Powered by Supabase RLS",
  },
  {
    name: "Campus Ambassador",
    tagline: "For student council leads, clubs, and college fest treasurers.",
    price: "₹0",
    frequency: "community edition",
    highlight: false,
    badge: "Club Edition",
    features: [
      "All Student Free features included",
      "Event and fest expense tracking",
      "Reimbursement record keeping",
      "Semester CSV summary exports",
      "Community GitHub open source access",
      "Early access to new features",
    ],
    ctaText: "Explore Club Tools",
    secondaryText: "Open source community • Built for students",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Is Smart Expense Tracking really 100% free for students?",
    answer: "Yes, completely! We built Smart Expense Tracking as a transparent tool to help students manage pocket money and college budgets without hitting predatory paywalls or credit card promos.",
  },
  {
    question: "How do monthly budget limits and warnings work?",
    answer: "You set a target allowance for the month (e.g. ₹20,000/month). As you log expenses, the dashboard calculates remaining funds and burn velocity. If you exceed 75% or 90% of your budget, the indicators shift from emerald to caution amber and rose alert.",
  },
  {
    question: "Can I customize categories for my college expenses?",
    answer: "Yes. Smart Expense Tracking includes campus-specific categories (Mess & Dining, Hostel & Rent, Books & Study, Transit, Tech & Utilities, Exam Fees, Social Outings). You can assign custom notes and payment methods (UPI, Card, Cash) to any expense.",
  },
  {
    question: "How is my financial data protected?",
    answer: "Your expenses are stored in a PostgreSQL database powered by Supabase with Row Level Security (RLS) enabled. Only your authenticated user ID has permission to read, insert, update, or delete your records.",
  },
  {
    question: "Can I export my expenses for parents or scholarship claims?",
    answer: "Yes. You can export a clean CSV spreadsheet with all your transactions anytime, ready to submit for student loan stipends, scholarship accounts, or hostel reimbursements.",
  },
];
