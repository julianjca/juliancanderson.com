-- Enable pg_cron extension for scheduled jobs
-- Note: This must be enabled in Supabase Dashboard > Database > Extensions
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net for HTTP requests (needed for calling API endpoints)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================================
-- WEEKLY REVIEW CREATION
-- Runs Sunday at 6pm to create a weekly review note
-- ============================================================================

CREATE OR REPLACE FUNCTION create_weekly_review(p_owner_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
  v_existing_id UUID;
  v_new_id UUID;
  v_tasks_completed INTEGER;
  v_tasks_in_progress INTEGER;
  v_tasks_blocked INTEGER;
  v_notes_created INTEGER;
  v_reading_minutes INTEGER;
  v_reading_pages INTEGER;
  v_body TEXT;
  v_title TEXT;
BEGIN
  -- Calculate week start (Sunday)
  v_week_start := date_trunc('week', CURRENT_DATE)::DATE;
  v_week_end := v_week_start + INTERVAL '7 days';

  -- Check if weekly review already exists
  SELECT id INTO v_existing_id
  FROM notes
  WHERE owner_id = p_owner_id
    AND note_type = 'weekly'
    AND date = v_week_start;

  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id;
  END IF;

  -- Gather stats
  SELECT COUNT(*) INTO v_tasks_completed
  FROM tasks
  WHERE owner_id = p_owner_id
    AND status = 'Done'
    AND completed_at >= v_week_start
    AND completed_at < v_week_end;

  SELECT COUNT(*) INTO v_tasks_in_progress
  FROM tasks
  WHERE owner_id = p_owner_id
    AND status = 'Doing';

  SELECT COUNT(*) INTO v_tasks_blocked
  FROM tasks
  WHERE owner_id = p_owner_id
    AND status = 'Blocked';

  SELECT COUNT(*) INTO v_notes_created
  FROM notes
  WHERE owner_id = p_owner_id
    AND created_at >= v_week_start
    AND created_at < v_week_end;

  SELECT COALESCE(SUM(minutes_read), 0), COALESCE(SUM(pages_read), 0)
  INTO v_reading_minutes, v_reading_pages
  FROM reading_sessions
  WHERE owner_id = p_owner_id
    AND session_date >= v_week_start
    AND session_date < v_week_end;

  -- Build the note body
  v_body := '# Weekly Review

## What went well this week?


## What didn''t work?


## What did I learn?


## Focus for next week


## Backlog Grooming
- [ ] Review tasks in Backlog
- [ ] Archive stale items
- [ ] Update priorities

---

## Automatic Rollups

*Stats will be populated when you save the review.*

### This Week''s Stats
- **Tasks completed:** ' || v_tasks_completed || '
- **Tasks in progress:** ' || v_tasks_in_progress || '
- **Tasks blocked:** ' || v_tasks_blocked || '
- **Notes created:** ' || v_notes_created || '
- **Reading:** ' || v_reading_minutes || ' minutes, ' || v_reading_pages || ' pages
';

  v_title := 'Weekly Review - Week of ' || TO_CHAR(v_week_start, 'Mon DD');

  -- Create the weekly review note
  INSERT INTO notes (owner_id, title, body_md, note_type, date, is_pinned, tags)
  VALUES (p_owner_id, v_title, v_body, 'weekly', v_week_start, FALSE, ARRAY['weekly-review'])
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

-- ============================================================================
-- RECURRING TASK GENERATION
-- Runs daily at 6am to create new instances of recurring tasks
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_next_date(p_rule TEXT, p_from_date DATE)
RETURNS DATE
LANGUAGE plpgsql
AS $$
DECLARE
  v_result DATE;
BEGIN
  v_result := p_from_date;

  CASE p_rule
    WHEN 'daily' THEN
      v_result := v_result + INTERVAL '1 day';
    WHEN 'weekdays' THEN
      v_result := v_result + INTERVAL '1 day';
      -- Skip weekends
      WHILE EXTRACT(DOW FROM v_result) IN (0, 6) LOOP
        v_result := v_result + INTERVAL '1 day';
      END LOOP;
    WHEN 'weekly' THEN
      v_result := v_result + INTERVAL '7 days';
    WHEN 'biweekly' THEN
      v_result := v_result + INTERVAL '14 days';
    WHEN 'monthly' THEN
      v_result := v_result + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      v_result := v_result + INTERVAL '3 months';
    WHEN 'yearly' THEN
      v_result := v_result + INTERVAL '1 year';
    ELSE
      v_result := v_result + INTERVAL '1 day';
  END CASE;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION generate_recurring_tasks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task RECORD;
  v_next_due DATE;
  v_next_next DATE;
  v_created INTEGER := 0;
BEGIN
  -- Find recurring tasks that need new instances
  FOR v_task IN
    SELECT *
    FROM tasks
    WHERE recurrence_rule IS NOT NULL
      AND recurrence_parent_id IS NULL  -- Only parent tasks
      AND (
        recurrence_next_at <= CURRENT_DATE
        OR (status = 'Done' AND recurrence_next_at IS NULL)
      )
  LOOP
    -- Calculate next due date
    v_next_due := calculate_next_date(
      v_task.recurrence_rule,
      COALESCE(v_task.due_date, CURRENT_DATE)
    );

    -- Create new task instance
    INSERT INTO tasks (
      owner_id,
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      tags,
      visibility,
      recurrence_parent_id,
      sort_order
    ) VALUES (
      v_task.owner_id,
      v_task.title,
      v_task.description,
      'Backlog',
      v_task.priority,
      v_next_due,
      v_task.project_id,
      v_task.tags,
      v_task.visibility,
      v_task.id,
      0
    );

    -- Update parent task's next recurrence date
    v_next_next := calculate_next_date(v_task.recurrence_rule, v_next_due);
    UPDATE tasks
    SET recurrence_next_at = v_next_next
    WHERE id = v_task.id;

    v_created := v_created + 1;
  END LOOP;

  RETURN v_created;
END;
$$;

-- ============================================================================
-- CRON JOB SCHEDULING
-- These must be run as the postgres user in Supabase SQL Editor
-- ============================================================================

-- Note: Replace 'YOUR_OWNER_USER_ID' with your actual Supabase user ID
-- You can find this by running: SELECT id FROM auth.users LIMIT 1;

-- Schedule weekly review creation for Sundays at 6pm UTC
-- SELECT cron.schedule(
--   'weekly-review',
--   '0 18 * * 0',
--   $$SELECT create_weekly_review('YOUR_OWNER_USER_ID'::UUID)$$
-- );

-- Schedule recurring task generation for daily at 6am UTC
-- SELECT cron.schedule(
--   'generate-recurring-tasks',
--   '0 6 * * *',
--   $$SELECT generate_recurring_tasks()$$
-- );

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule a job:
-- SELECT cron.unschedule('weekly-review');
-- SELECT cron.unschedule('generate-recurring-tasks');

-- To view job run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
