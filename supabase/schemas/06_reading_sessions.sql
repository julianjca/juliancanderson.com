-- Reading sessions table (for analytics)
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_item_id UUID NOT NULL REFERENCES reading_items(id) ON DELETE CASCADE,

  minutes_read INTEGER NOT NULL DEFAULT 0,
  pages_read INTEGER DEFAULT 0,

  session_date DATE NOT NULL DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_owner ON reading_sessions(owner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_item ON reading_sessions(reading_item_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON reading_sessions(owner_id, session_date);

ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own reading sessions" ON reading_sessions;
CREATE POLICY "Users can CRUD their own reading sessions"
  ON reading_sessions FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
