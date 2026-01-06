-- Public dashboard configuration
-- Stores widget configuration for the public dashboard

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  title TEXT,
  config JSONB DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Widget types:
-- 'working_on' - Shows public tasks in Doing status
-- 'reading_now' - Shows public reading items with status='reading'
-- 'recent_notes' - Shows recent public notes
-- 'projects' - Shows public projects with progress
-- 'stats' - Shows aggregate stats (tasks completed, reading streaks)

-- Enable RLS
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- Policies: owner can manage, public can read enabled widgets
CREATE POLICY "Users can manage own widgets"
  ON public.dashboard_widgets FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can read enabled widgets"
  ON public.dashboard_widgets FOR SELECT
  USING (is_enabled = true);

-- Index
CREATE INDEX IF NOT EXISTS dashboard_widgets_owner_idx ON public.dashboard_widgets(owner_id);
CREATE INDEX IF NOT EXISTS dashboard_widgets_sort_idx ON public.dashboard_widgets(owner_id, sort_order);
