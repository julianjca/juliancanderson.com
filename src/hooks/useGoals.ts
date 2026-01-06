import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type GoalCategory = 'career' | 'health' | 'finance' | 'relationships' | 'learning' | 'creative' | 'personal' | 'other'
export type GoalTimeframe = 'yearly' | 'quarterly' | 'monthly' | 'weekly'
export type GoalStatus = 'active' | 'completed' | 'abandoned' | 'paused'

export interface Goal {
  id: string
  owner_id: string
  title: string
  description: string | null
  category: GoalCategory | null
  timeframe: GoalTimeframe | null
  status: GoalStatus
  progress: number
  target_date: string | null
  started_at: string
  completed_at: string | null
  project_id: string | null
  visibility: 'private' | 'unlisted' | 'public'
  created_at: string
  updated_at: string
}

export interface GoalMilestone {
  id: string
  goal_id: string
  owner_id: string
  title: string
  is_completed: boolean
  completed_at: string | null
  sort_order: number
  created_at: string
}

const GOALS_KEY = ['goals']

export function useGoals(filters?: { status?: GoalStatus; timeframe?: GoalTimeframe; category?: GoalCategory }) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...GOALS_KEY, filters],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.timeframe) {
        query = query.eq('timeframe', filters.timeframe)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Goal[]
    },
    enabled: !!supabase,
  })
}

export function useGoal(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...GOALS_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Goal
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goal: Partial<Omit<Goal, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('goals')
        .insert({
          title: goal.title || 'New Goal',
          description: goal.description || null,
          category: goal.category || null,
          timeframe: goal.timeframe || null,
          status: goal.status || 'active',
          progress: goal.progress || 0,
          target_date: goal.target_date || null,
          project_id: goal.project_id || null,
          visibility: goal.visibility || 'private',
        })
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY })
    },
  })
}

export function useUpdateGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY })
    },
  })
}

export function useDeleteGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY })
    },
  })
}

// Milestones
const MILESTONES_KEY = ['goal-milestones']

export function useGoalMilestones(goalId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...MILESTONES_KEY, goalId],
    queryFn: async () => {
      if (!supabase) return []

      const { data, error } = await supabase
        .from('goal_milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('sort_order')

      if (error) throw error
      return data as GoalMilestone[]
    },
    enabled: !!supabase && !!goalId,
  })
}

export function useCreateMilestone() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ goal_id, title }: { goal_id: string; title: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      // Get max sort_order
      const { data: maxOrder } = await supabase
        .from('goal_milestones')
        .select('sort_order')
        .eq('goal_id', goal_id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

      const sort_order = (maxOrder?.sort_order ?? -1) + 1

      const { data, error } = await supabase
        .from('goal_milestones')
        .insert({ goal_id, title, sort_order })
        .select()
        .single()

      if (error) throw error
      return data as GoalMilestone
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MILESTONES_KEY, variables.goal_id] })
    },
  })
}

export function useToggleMilestone() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, goal_id, is_completed }: { id: string; goal_id: string; is_completed: boolean }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('goal_milestones')
        .update({
          is_completed,
          completed_at: is_completed ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as GoalMilestone
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MILESTONES_KEY, variables.goal_id] })
    },
  })
}

export function useDeleteMilestone() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, goal_id }: { id: string; goal_id: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('goal_milestones').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MILESTONES_KEY, variables.goal_id] })
    },
  })
}
