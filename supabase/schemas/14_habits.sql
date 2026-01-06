-- Habits table for habit tracking
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '✅',

  -- Frequency
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'weekly', 'custom')),
  custom_days INTEGER[] DEFAULT '{}', -- 0=Sun, 1=Mon, etc. for custom frequency

  -- Goal
  target_count INTEGER DEFAULT 1, -- How many times per period
  unit TEXT DEFAULT 'times', -- "times", "minutes", "glasses", etc.

  -- Tracking
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  color TEXT DEFAULT '#f97316',

  -- Stats (denormalized for performance)
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_owner ON habits(owner_id);
CREATE INDEX IF NOT EXISTS idx_habits_active ON habits(owner_id, is_active);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own habits" ON habits;
CREATE POLICY "Users can CRUD their own habits"
  ON habits FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Habit logs for daily tracking
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  log_date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 1, -- How many times completed that day
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(habit_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit ON habit_logs(habit_id, log_date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(owner_id, log_date);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own habit logs" ON habit_logs;
CREATE POLICY "Users can CRUD their own habit logs"
  ON habit_logs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Function to update habit streaks when a log is added/removed
CREATE OR REPLACE FUNCTION update_habit_streaks()
RETURNS TRIGGER AS $$
DECLARE
  streak INTEGER := 0;
  prev_date DATE;
  log_record RECORD;
  habit_record RECORD;
BEGIN
  -- Get the habit
  SELECT * INTO habit_record FROM habits WHERE id = COALESCE(NEW.habit_id, OLD.habit_id);

  -- Calculate current streak
  prev_date := CURRENT_DATE;
  FOR log_record IN
    SELECT DISTINCT log_date
    FROM habit_logs
    WHERE habit_id = habit_record.id
    ORDER BY log_date DESC
  LOOP
    -- Check if this date is consecutive (accounting for frequency)
    IF habit_record.frequency = 'daily' THEN
      IF log_record.log_date = prev_date OR log_record.log_date = prev_date - 1 THEN
        streak := streak + 1;
        prev_date := log_record.log_date;
      ELSE
        EXIT;
      END IF;
    ELSIF habit_record.frequency = 'weekdays' THEN
      -- Skip weekends when checking consecutiveness
      IF log_record.log_date >= prev_date - 3 THEN -- Allow 3 day gap for weekends
        streak := streak + 1;
        prev_date := log_record.log_date;
      ELSE
        EXIT;
      END IF;
    ELSE
      -- For other frequencies, just count completions
      streak := streak + 1;
      prev_date := log_record.log_date;
    END IF;
  END LOOP;

  -- Update habit stats
  UPDATE habits
  SET
    current_streak = streak,
    longest_streak = GREATEST(longest_streak, streak),
    total_completions = (SELECT COUNT(*) FROM habit_logs WHERE habit_id = habit_record.id),
    updated_at = NOW()
  WHERE id = habit_record.id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS habit_log_streak_trigger ON habit_logs;
CREATE TRIGGER habit_log_streak_trigger
  AFTER INSERT OR DELETE
  ON habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streaks();
