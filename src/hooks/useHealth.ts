import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type WorkoutType = 'strength' | 'cardio' | 'yoga' | 'sports' | 'walking' | 'cycling' | 'swimming' | 'other'

export interface Workout {
  id: string
  owner_id: string
  title: string
  workout_type: WorkoutType | null
  workout_date: string
  duration_minutes: number | null
  calories_burned: number | null
  distance_km: number | null
  notes: string | null
  energy_level: number | null
  difficulty: number | null
  created_at: string
  updated_at: string
}

export interface WorkoutExercise {
  id: string
  workout_id: string
  owner_id: string
  exercise_name: string
  sets: number | null
  reps: number | null
  weight_kg: number | null
  duration_seconds: number | null
  notes: string | null
  sort_order: number
  created_at: string
}

export interface WeightLog {
  id: string
  owner_id: string
  log_date: string
  weight_kg: number
  notes: string | null
  created_at: string
}

const WORKOUTS_KEY = ['workouts']
const WEIGHT_KEY = ['weight-logs']

export function useWorkouts(limit?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...WORKOUTS_KEY, { limit }],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('workouts')
        .select('*')
        .order('workout_date', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Workout[]
    },
    enabled: !!supabase,
  })
}

export function useWorkout(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...WORKOUTS_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Workout
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateWorkout() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workout: Partial<Omit<Workout, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('workouts')
        .insert({
          title: workout.title || 'Workout',
          workout_type: workout.workout_type || null,
          workout_date: workout.workout_date || new Date().toISOString().split('T')[0],
          duration_minutes: workout.duration_minutes || null,
          calories_burned: workout.calories_burned || null,
          distance_km: workout.distance_km || null,
          notes: workout.notes || null,
          energy_level: workout.energy_level || null,
          difficulty: workout.difficulty || null,
        })
        .select()
        .single()

      if (error) throw error
      return data as Workout
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_KEY })
    },
  })
}

export function useUpdateWorkout() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Workout> & { id: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Workout
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_KEY })
    },
  })
}

export function useDeleteWorkout() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('workouts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_KEY })
    },
  })
}

// Weight logs
export function useWeightLogs(limit?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...WEIGHT_KEY, { limit }],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('weight_logs')
        .select('*')
        .order('log_date', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data as WeightLog[]
    },
    enabled: !!supabase,
  })
}

export function useLogWeight() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ log_date, weight_kg, notes }: { log_date: string; weight_kg: number; notes?: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('weight_logs')
        .upsert({
          log_date,
          weight_kg,
          notes: notes || null,
        }, { onConflict: 'owner_id,log_date' })
        .select()
        .single()

      if (error) throw error
      return data as WeightLog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEIGHT_KEY })
    },
  })
}

// Stats
export function useWorkoutStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: [...WORKOUTS_KEY, 'stats'],
    queryFn: async () => {
      if (!supabase) return null

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data, error } = await supabase
        .from('workouts')
        .select('workout_date, duration_minutes, calories_burned')
        .gte('workout_date', thirtyDaysAgo.toISOString().split('T')[0])

      if (error) throw error

      const workouts = data || []
      return {
        totalWorkouts: workouts.length,
        totalMinutes: workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0),
        totalCalories: workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
        workoutsPerWeek: Math.round((workouts.length / 30) * 7 * 10) / 10,
      }
    },
    enabled: !!supabase,
  })
}
