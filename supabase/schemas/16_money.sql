-- Transactions table for expense/income tracking
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL, -- Positive for income, negative for expenses
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Categorization
  category TEXT CHECK (category IN (
    'salary', 'freelance', 'investments', 'other_income',
    'housing', 'utilities', 'groceries', 'dining', 'transport',
    'health', 'entertainment', 'shopping', 'subscriptions',
    'education', 'gifts', 'travel', 'personal', 'other'
  )),

  -- Optional details
  account TEXT, -- e.g., "Chase Checking", "Credit Card"
  notes TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Recurring
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT CHECK (recurrence_rule IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_owner ON transactions(owner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(owner_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(owner_id, transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(owner_id, category);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own transactions" ON transactions;
CREATE POLICY "Users can CRUD their own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Budgets table for budget tracking by category
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  category TEXT NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL,
  notes TEXT,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(owner_id, category)
);

CREATE INDEX IF NOT EXISTS idx_budgets_owner ON budgets(owner_id);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own budgets" ON budgets;
CREATE POLICY "Users can CRUD their own budgets"
  ON budgets FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
