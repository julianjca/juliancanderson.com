import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom'

export interface Habit {
  id: string
  owner_id: string
  name: string
  description: string | null
  emoji: string
  frequency: HabitFrequency
  custom_days: number[]
  target_count: number
  unit: string
  is_active: boolean
  color: string
  current_streak: number
  longest_streak: number
  total_completions: number
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  owner_id: string
  log_date: string
  count: number
  notes: string | null
  created_at: string
}

const HABITS_KEY = ['habits']
const HABIT_LOGS_KEY = ['habit-logs']

export function useHabits(activeOnly = true) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...HABITS_KEY, { activeOnly }],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Habit[]
    },
    enabled: !!supabase,
  })
}

export function useHabit(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...HABITS_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Habit
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habit: Partial<Omit<Habit, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'current_streak' | 'longest_streak' | 'total_completions'>>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: habit.name || 'New Habit',
          description: habit.description || null,
          emoji: habit.emoji || '✅',
          frequency: habit.frequency || 'daily',
          custom_days: habit.custom_days || [],
          target_count: habit.target_count || 1,
          unit: habit.unit || 'times',
          is_active: habit.is_active !== false,
          color: habit.color || '#f97316',
        })
        .select()
        .single()

      if (error) throw error
      return data as Habit
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY })
    },
  })
}

export function useUpdateHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Habit> & { id: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Habit
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY })
    },
  })
}

export function useDeleteHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('habits').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY })
    },
  })
}

// Habit logs
export function useHabitLogs(habitId: string, startDate?: string, endDate?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...HABIT_LOGS_KEY, habitId, startDate, endDate],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .order('log_date', { ascending: false })

      if (startDate) {
        query = query.gte('log_date', startDate)
      }
      if (endDate) {
        query = query.lte('log_date', endDate)
      }

      const { data, error } = await query
      if (error) throw error
      return data as HabitLog[]
    },
    enabled: !!supabase && !!habitId,
  })
}

// Get all habit logs for a date range (for all habits)
export function useHabitLogsForRange(startDate: string, endDate: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...HABIT_LOGS_KEY, 'range', startDate, endDate],
    queryFn: async () => {
      if (!supabase) return []

      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .gte('log_date', startDate)
        .lte('log_date', endDate)
        .order('log_date', { ascending: true })

      if (error) throw error
      return data as HabitLog[]
    },
    enabled: !!supabase && !!startDate && !!endDate,
  })
}

export function useLogHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ habit_id, log_date, count = 1, notes }: { habit_id: string; log_date: string; count?: number; notes?: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('habit_logs')
        .upsert({
          habit_id,
          log_date,
          count,
          notes: notes || null,
        }, { onConflict: 'habit_id,log_date' })
        .select()
        .single()

      if (error) throw error
      return data as HabitLog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY })
      queryClient.invalidateQueries({ queryKey: HABIT_LOGS_KEY })
    },
  })
}

export function useUnlogHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ habit_id, log_date }: { habit_id: string; log_date: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habit_id)
        .eq('log_date', log_date)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY })
      queryClient.invalidateQueries({ queryKey: HABIT_LOGS_KEY })
    },
  })
}
