-- Reading items table
CREATE TABLE IF NOT EXISTS reading_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,

  item_type TEXT NOT NULL DEFAULT 'book' CHECK (item_type IN ('book', 'article', 'paper', 'other')),
  url TEXT,

  status TEXT NOT NULL DEFAULT 'to_read' CHECK (status IN ('to_read', 'reading', 'finished', 'abandoned')),

  total_pages INTEGER,
  current_page INTEGER DEFAULT 0,

  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_owner ON reading_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_reading_status ON reading_items(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_reading_type ON reading_items(owner_id, item_type);

ALTER TABLE reading_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own reading items" ON reading_items;
CREATE POLICY "Users can CRUD their own reading items"
  ON reading_items FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
