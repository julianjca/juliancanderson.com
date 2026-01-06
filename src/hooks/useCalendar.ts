import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  htmlLink?: string
  calendarId: string
  calendarName?: string
  colorId?: string
}

export interface CalendarConnection {
  id: string
  owner_id: string
  provider: 'google'
  access_token: string
  refresh_token: string
  token_expires_at: string
  calendars_enabled: string[] // calendar IDs to show
  created_at: string
  updated_at: string
}

// Fetch calendar events for a specific date range
export function useCalendarEvents(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['calendar-events', startDate, endDate],
    queryFn: async () => {
      const res = await fetch(`/api/calendar/events?start=${startDate}&end=${endDate}`)
      if (!res.ok) {
        if (res.status === 401) {
          return { events: [], needsAuth: true }
        }
        throw new Error('Failed to fetch calendar events')
      }
      const data = await res.json()
      return { events: data.events as CalendarEvent[], needsAuth: false }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

// Fetch calendar connection status
export function useCalendarConnection() {
  return useQuery({
    queryKey: ['calendar-connection'],
    queryFn: async () => {
      const supabase = createClient()
      if (!supabase) return null

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('owner_id', user.id)
        .eq('provider', 'google')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as CalendarConnection | null
    },
  })
}

// Fetch available calendars from connected account
export function useAvailableCalendars() {
  return useQuery({
    queryKey: ['available-calendars'],
    queryFn: async () => {
      const res = await fetch('/api/calendar/list')
      if (!res.ok) {
        if (res.status === 401) return []
        throw new Error('Failed to fetch calendars')
      }
      const data = await res.json()
      return data.calendars as Array<{ id: string; name: string; primary: boolean; backgroundColor?: string }>
    },
    retry: false,
  })
}

// Update enabled calendars
export function useUpdateCalendarSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (calendarsEnabled: string[]) => {
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not available')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('calendar_connections')
        .update({ calendars_enabled: calendarsEnabled, updated_at: new Date().toISOString() })
        .eq('owner_id', user.id)
        .eq('provider', 'google')
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-connection'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
    },
  })
}

// Disconnect calendar
export function useDisconnectCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/calendar/disconnect', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to disconnect calendar')
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-connection'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
      queryClient.invalidateQueries({ queryKey: ['available-calendars'] })
    },
  })
}
