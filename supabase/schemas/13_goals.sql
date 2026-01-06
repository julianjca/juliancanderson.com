-- Goals table for long-term goal tracking
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Goal categorization
  category TEXT CHECK (category IN ('career', 'health', 'finance', 'relationships', 'learning', 'creative', 'personal', 'other')),
  timeframe TEXT CHECK (timeframe IN ('yearly', 'quarterly', 'monthly', 'weekly')),

  -- Tracking
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Dates
  target_date DATE,
  started_at DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,

  -- Links
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

  -- Visibility
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_owner ON goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_timeframe ON goals(owner_id, timeframe);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(owner_id, category);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own goals" ON goals;
CREATE POLICY "Users can CRUD their own goals"
  ON goals FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Goal milestones/key results
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal ON goal_milestones(goal_id);

ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own goal milestones" ON goal_milestones;
CREATE POLICY "Users can CRUD their own goal milestones"
  ON goal_milestones FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
