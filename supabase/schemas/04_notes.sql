-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  body_md TEXT DEFAULT '',

  note_type TEXT NOT NULL DEFAULT 'note' CHECK (note_type IN ('note', 'daily', 'weekly')),
  note_date DATE,

  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,

  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

  tags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  slug TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_owner ON notes(owner_id);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(owner_id, note_type);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(owner_id, note_type, note_date) WHERE note_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(owner_id, is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project_id) WHERE project_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_slug ON notes(slug) WHERE slug IS NOT NULL AND visibility != 'private';

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own notes" ON notes;
CREATE POLICY "Users can CRUD their own notes"
  ON notes FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
