-- Project task stats view
CREATE OR REPLACE VIEW project_task_stats AS
SELECT
  p.id as project_id,
  p.owner_id,
  COUNT(t.id) FILTER (WHERE t.status != 'Done') as open_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'Done') as completed_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'Blocked') as blocked_tasks,
  COUNT(t.id) as total_tasks
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id, p.owner_id;

-- Reading stats view (for analytics)
CREATE OR REPLACE VIEW reading_stats AS
SELECT
  owner_id,
  session_date,
  SUM(minutes_read) as total_minutes,
  SUM(pages_read) as total_pages,
  COUNT(DISTINCT reading_item_id) as items_read
FROM reading_sessions
GROUP BY owner_id, session_date;
