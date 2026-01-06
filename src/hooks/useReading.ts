import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface ReadingItem {
  id: string
  owner_id: string
  title: string
  author: string | null
  cover_url: string | null
  item_type: 'book' | 'article' | 'paper' | 'other'
  url: string | null
  status: 'to_read' | 'reading' | 'finished' | 'abandoned'
  total_pages: number | null
  current_page: number
  started_at: string | null
  finished_at: string | null
  rating: number | null
  notes: string | null
  tags: string[]
  visibility: 'private' | 'unlisted' | 'public'
  created_at: string
  updated_at: string
}

export interface ReadingSession {
  id: string
  owner_id: string
  reading_item_id: string
  minutes_read: number
  pages_read: number
  session_date: string
  created_at: string
}

export type ReadingItemInsert = Omit<ReadingItem, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
export type ReadingItemUpdate = Partial<ReadingItemInsert> & { id: string }

const READING_KEY = ['reading']
const SESSIONS_KEY = ['reading_sessions']

export function useReadingItems(status?: ReadingItem['status']) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...READING_KEY, status],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('reading_items')
        .select('*')
        .order('updated_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data as ReadingItem[]
    },
    enabled: !!supabase,
  })
}

export function useReadingItem(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...READING_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('reading_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ReadingItem
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateReadingItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: Partial<ReadingItemInsert>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('reading_items')
        .insert({
          title: item.title || 'Untitled',
          author: item.author || null,
          cover_url: item.cover_url || null,
          item_type: item.item_type || 'book',
          url: item.url || null,
          status: item.status || 'to_read',
          total_pages: item.total_pages || null,
          current_page: item.current_page || 0,
          started_at: item.started_at || null,
          finished_at: item.finished_at || null,
          rating: item.rating || null,
          notes: item.notes || null,
          tags: item.tags || [],
          visibility: item.visibility || 'private',
        })
        .select()
        .single()

      if (error) throw error
      return data as ReadingItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: READING_KEY })
    },
  })
}

export function useUpdateReadingItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ReadingItemUpdate) => {
      if (!supabase) throw new Error('Supabase not available')

      // Auto-set timestamps based on status changes
      const enrichedUpdates: Partial<ReadingItemInsert> = { ...updates }
      if (updates.status === 'reading' && !updates.started_at) {
        enrichedUpdates.started_at = new Date().toISOString()
      }
      if (updates.status === 'finished' && !updates.finished_at) {
        enrichedUpdates.finished_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('reading_items')
        .update(enrichedUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ReadingItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: READING_KEY })
    },
  })
}

export function useDeleteReadingItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('reading_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: READING_KEY })
    },
  })
}

// Reading Sessions
export function useReadingSessions(itemId?: string, days?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...SESSIONS_KEY, itemId, days],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('reading_sessions')
        .select('*')
        .order('session_date', { ascending: false })

      if (itemId) {
        query = query.eq('reading_item_id', itemId)
      }

      if (days) {
        const fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - days)
        query = query.gte('session_date', fromDate.toISOString().split('T')[0])
      }

      const { data, error } = await query
      if (error) throw error
      return data as ReadingSession[]
    },
    enabled: !!supabase,
  })
}

export function useLogReadingSession() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      reading_item_id,
      minutes_read,
      pages_read = 0,
      session_date,
    }: {
      reading_item_id: string
      minutes_read: number
      pages_read?: number
      session_date?: string
    }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('reading_sessions')
        .insert({
          reading_item_id,
          minutes_read,
          pages_read,
          session_date: session_date || new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error

      // Also update current_page on the reading item if pages logged
      if (pages_read > 0) {
        const { data: item } = await supabase
          .from('reading_items')
          .select('current_page')
          .eq('id', reading_item_id)
          .single()

        if (item) {
          await supabase
            .from('reading_items')
            .update({ current_page: (item.current_page || 0) + pages_read })
            .eq('id', reading_item_id)
        }
      }

      return data as ReadingSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: READING_KEY })
    },
  })
}

// Stats
export function useReadingStats(days: number = 7) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...SESSIONS_KEY, 'stats', days],
    queryFn: async () => {
      if (!supabase) return { totalMinutes: 0, totalPages: 0, sessionCount: 0 }

      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)

      const { data, error } = await supabase
        .from('reading_sessions')
        .select('minutes_read, pages_read')
        .gte('session_date', fromDate.toISOString().split('T')[0])

      if (error) throw error

      const stats = (data || []).reduce(
        (acc, session) => ({
          totalMinutes: acc.totalMinutes + (session.minutes_read || 0),
          totalPages: acc.totalPages + (session.pages_read || 0),
          sessionCount: acc.sessionCount + 1,
        }),
        { totalMinutes: 0, totalPages: 0, sessionCount: 0 }
      )

      return stats
    },
    enabled: !!supabase,
  })
}
