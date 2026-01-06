-- Task recurrence fields
-- Adds support for recurring tasks

-- Add recurrence columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_rule TEXT CHECK (recurrence_rule IN ('daily', 'weekdays', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_parent_id UUID REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_next_at DATE;

-- Index for finding tasks that need recurring instances generated
CREATE INDEX IF NOT EXISTS idx_tasks_recurrence ON tasks(owner_id, recurrence_next_at)
  WHERE recurrence_rule IS NOT NULL AND recurrence_next_at IS NOT NULL;

-- Index for finding instances of a recurring task
CREATE INDEX IF NOT EXISTS idx_tasks_recurrence_parent ON tasks(recurrence_parent_id)
  WHERE recurrence_parent_id IS NOT NULL;

-- Function to calculate the next occurrence date
CREATE OR REPLACE FUNCTION calculate_next_recurrence(
  rule TEXT,
  from_date DATE
) RETURNS DATE AS $$
BEGIN
  RETURN CASE rule
    WHEN 'daily' THEN from_date + INTERVAL '1 day'
    WHEN 'weekdays' THEN
      CASE EXTRACT(DOW FROM from_date)
        WHEN 5 THEN from_date + INTERVAL '3 days'  -- Friday -> Monday
        WHEN 6 THEN from_date + INTERVAL '2 days'  -- Saturday -> Monday
        ELSE from_date + INTERVAL '1 day'
      END
    WHEN 'weekly' THEN from_date + INTERVAL '1 week'
    WHEN 'biweekly' THEN from_date + INTERVAL '2 weeks'
    WHEN 'monthly' THEN from_date + INTERVAL '1 month'
    WHEN 'quarterly' THEN from_date + INTERVAL '3 months'
    WHEN 'yearly' THEN from_date + INTERVAL '1 year'
    ELSE NULL
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to set recurrence_next_at when a recurring task is created/updated
CREATE OR REPLACE FUNCTION update_recurrence_next_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if this is a recurring task (has rule, not an instance)
  IF NEW.recurrence_rule IS NOT NULL AND NEW.recurrence_parent_id IS NULL THEN
    -- Set next occurrence based on due_date or today
    NEW.recurrence_next_at := calculate_next_recurrence(
      NEW.recurrence_rule,
      COALESCE(NEW.due_date, CURRENT_DATE)
    );
  ELSE
    NEW.recurrence_next_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS task_recurrence_trigger ON tasks;
CREATE TRIGGER task_recurrence_trigger
  BEFORE INSERT OR UPDATE OF recurrence_rule, due_date
  ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_recurrence_next_at();
