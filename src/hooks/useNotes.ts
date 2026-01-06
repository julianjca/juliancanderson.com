import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Note {
  id: string
  owner_id: string
  title: string
  body_md: string
  note_type: 'note' | 'daily' | 'weekly'
  note_date: string | null
  is_pinned: boolean
  project_id: string | null
  tags: string[]
  visibility: 'private' | 'unlisted' | 'public'
  slug: string | null
  created_at: string
  updated_at: string
}

export type NoteInsert = Omit<Note, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
export type NoteUpdate = Partial<NoteInsert> & { id: string }

const NOTES_KEY = ['notes']

export function useNotes(filters?: { note_type?: string; project_id?: string; is_pinned?: boolean }) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, filters],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (filters?.note_type) {
        query = query.eq('note_type', filters.note_type)
      }
      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id)
      }
      if (filters?.is_pinned !== undefined) {
        query = query.eq('is_pinned', filters.is_pinned)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Note[]
    },
    enabled: !!supabase,
  })
}

export function useNote(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Note
    },
    enabled: !!supabase && !!id,
  })
}

export function useDailyNote(date: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, 'daily', date],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('note_type', 'daily')
        .eq('note_date', date)
        .maybeSingle()

      if (error) throw error
      return data as Note | null
    },
    enabled: !!supabase && !!date,
  })
}

export function useCreateNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (note: Partial<NoteInsert>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: note.title || 'Untitled Note',
          body_md: note.body_md || '',
          note_type: note.note_type || 'note',
          note_date: note.note_date || null,
          is_pinned: note.is_pinned || false,
          project_id: note.project_id || null,
          tags: note.tags || [],
          visibility: note.visibility || 'private',
          slug: note.slug || null,
        })
        .select()
        .single()

      if (error) throw error
      return data as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
    },
  })
}

export function useUpdateNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: NoteUpdate) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
    },
  })
}

export function useDeleteNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
    },
  })
}

export function useGetOrCreateDailyNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (date: string) => {
      if (!supabase) throw new Error('Supabase not available')

      // Check if daily note exists
      const { data: existing } = await supabase
        .from('notes')
        .select('*')
        .eq('note_type', 'daily')
        .eq('note_date', date)
        .maybeSingle()

      if (existing) return existing as Note

      // Create new daily note
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: `Daily Note - ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
          body_md: `## Focus\n\nWhat are your top 3 priorities today?\n\n1. \n2. \n3. \n\n## Schedule\n\nKey blocks and meetings\n\n## Log\n\nTrack progress throughout the day\n`,
          note_type: 'daily',
          note_date: date,
          is_pinned: false,
          tags: [],
          visibility: 'private',
        })
        .select()
        .single()

      if (error) throw error
      return data as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
    },
  })
}

// Backlinks - notes that link TO the given note
export interface NoteLink {
  id: string
  source_note_id: string
  target_note_id: string
  link_text: string
  source_note?: {
    id: string
    title: string
    note_type: string
  }
}

export function useBacklinks(noteId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, 'backlinks', noteId],
    queryFn: async () => {
      if (!supabase) return []

      const { data, error } = await supabase
        .from('note_links')
        .select(`
          id,
          source_note_id,
          target_note_id,
          link_text,
          source_note:notes!source_note_id(id, title, note_type)
        `)
        .eq('target_note_id', noteId)

      if (error) throw error

      // Transform the data to flatten the source_note array
      return (data || []).map((item) => ({
        ...item,
        source_note: Array.isArray(item.source_note) ? item.source_note[0] : item.source_note,
      })) as NoteLink[]
    },
    enabled: !!supabase && !!noteId,
  })
}

// Forward links - notes that the given note links TO
interface ForwardLink extends NoteLink {
  target_note?: { id: string; title: string; note_type: string }
}

export function useForwardLinks(noteId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, 'forwardlinks', noteId],
    queryFn: async () => {
      if (!supabase) return []

      const { data, error } = await supabase
        .from('note_links')
        .select(`
          id,
          source_note_id,
          target_note_id,
          link_text,
          target_note:notes!target_note_id(id, title, note_type)
        `)
        .eq('source_note_id', noteId)

      if (error) throw error

      // Transform the data to flatten the target_note array
      return (data || []).map((item) => ({
        ...item,
        target_note: Array.isArray(item.target_note) ? item.target_note[0] : item.target_note,
      })) as ForwardLink[]
    },
    enabled: !!supabase && !!noteId,
  })
}

// Search notes by title for wikilink autocomplete
export function useNoteSearch(query: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...NOTES_KEY, 'search', query],
    queryFn: async () => {
      if (!supabase || !query) return []

      const { data, error } = await supabase
        .from('notes')
        .select('id, title, note_type')
        .ilike('title', `%${query}%`)
        .limit(10)

      if (error) throw error
      return data as { id: string; title: string; note_type: string }[]
    },
    enabled: !!supabase && query.length >= 2,
  })
}
