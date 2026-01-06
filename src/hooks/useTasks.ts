import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type RecurrenceRule = 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Task {
  id: string
  owner_id: string
  title: string
  description: string | null
  status: 'Backlog' | 'Next' | 'Doing' | 'Blocked' | 'Done'
  sort_order: number
  priority: 'low' | 'medium' | 'high' | 'urgent' | null
  due_date: string | null
  completed_at: string | null
  project_id: string | null
  tags: string[]
  visibility: 'private' | 'unlisted' | 'public'
  recurrence_rule: RecurrenceRule | null
  recurrence_parent_id: string | null
  recurrence_next_at: string | null
  created_at: string
  updated_at: string
}

export type TaskInsert = Omit<Task, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
export type TaskUpdate = Partial<TaskInsert> & { id: string }

const TASKS_KEY = ['tasks']

export function useTasks(filters?: { status?: string; project_id?: string }) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...TASKS_KEY, filters],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('tasks')
        .select('*')
        .order('sort_order', { ascending: true })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Task[]
    },
    enabled: !!supabase,
  })
}

export function useTask(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...TASKS_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Task
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateTask() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: Omit<TaskInsert, 'sort_order'>) => {
      if (!supabase) throw new Error('Supabase not available')

      // Get max sort_order for the status column
      const { data: maxOrder } = await supabase
        .from('tasks')
        .select('sort_order')
        .eq('status', task.status || 'Backlog')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

      const sort_order = (maxOrder?.sort_order ?? -1) + 1

      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, sort_order })
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}

export function useUpdateTask() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: TaskUpdate) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}

export function useDeleteTask() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}

export function useMoveTask() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      sort_order,
    }: {
      id: string
      status: Task['status']
      sort_order: number
    }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('tasks')
        .update({ status, sort_order })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}
