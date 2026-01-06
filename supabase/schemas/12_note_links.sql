-- Note links table for storing backlinks/wikilinks
-- Tracks which notes link to which other notes

CREATE TABLE IF NOT EXISTS note_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  source_note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  target_note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,

  -- The display text used in the link (e.g., [[display text|id]])
  link_text TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate links
  UNIQUE(source_note_id, target_note_id)
);

CREATE INDEX IF NOT EXISTS idx_note_links_source ON note_links(source_note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_target ON note_links(target_note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_owner ON note_links(owner_id);

ALTER TABLE note_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own note links" ON note_links;
CREATE POLICY "Users can CRUD their own note links"
  ON note_links FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Function to extract and update note links when a note is saved
CREATE OR REPLACE FUNCTION extract_note_links()
RETURNS TRIGGER AS $$
DECLARE
  link_match TEXT;
  link_title TEXT;
  target_id UUID;
BEGIN
  -- Delete existing links from this note
  DELETE FROM note_links WHERE source_note_id = NEW.id;

  -- Extract all [[wikilinks]] from the body
  -- Pattern matches [[Title]] or [[Title|alias]]
  FOR link_match IN
    SELECT (regexp_matches(NEW.body_md, '\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', 'g'))[1]
  LOOP
    link_title := trim(link_match);

    -- Find target note by title (case-insensitive)
    SELECT id INTO target_id
    FROM notes
    WHERE owner_id = NEW.owner_id
      AND lower(title) = lower(link_title)
      AND id != NEW.id
    LIMIT 1;

    -- If found, create the link
    IF target_id IS NOT NULL THEN
      INSERT INTO note_links (owner_id, source_note_id, target_note_id, link_text)
      VALUES (NEW.owner_id, NEW.id, target_id, link_title)
      ON CONFLICT (source_note_id, target_note_id) DO UPDATE
        SET link_text = EXCLUDED.link_text;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS note_links_trigger ON notes;
CREATE TRIGGER note_links_trigger
  AFTER INSERT OR UPDATE OF body_md
  ON notes
  FOR EACH ROW
  EXECUTE FUNCTION extract_note_links();
