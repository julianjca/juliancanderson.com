import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface DashboardWidget {
  id: string
  owner_id: string
  widget_type: 'working_on' | 'reading_now' | 'recent_notes' | 'projects' | 'stats'
  title: string | null
  config: Record<string, unknown>
  sort_order: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export type WidgetInsert = Omit<DashboardWidget, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
export type WidgetUpdate = Partial<WidgetInsert> & { id: string }

const WIDGETS_KEY = ['dashboard-widgets']

// Fetch widgets for dashboard configuration
export function useDashboardWidgets() {
  return useQuery({
    queryKey: WIDGETS_KEY,
    queryFn: async () => {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .order('sort_order')

      if (error) throw error
      return data as DashboardWidget[]
    },
  })
}

// Create a new widget
export function useCreateWidget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (widget: WidgetInsert) => {
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('dashboard_widgets')
        .insert(widget)
        .select()
        .single()

      if (error) throw error
      return data as DashboardWidget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY })
    },
  })
}

// Update a widget
export function useUpdateWidget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: WidgetUpdate) => {
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('dashboard_widgets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as DashboardWidget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY })
    },
  })
}

// Delete a widget
export function useDeleteWidget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase
        .from('dashboard_widgets')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY })
    },
  })
}

// Reorder widgets
export function useReorderWidgets() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (widgetIds: string[]) => {
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not available')

      // Update sort_order for each widget
      const updates = widgetIds.map((id, index) => ({
        id,
        sort_order: index,
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('dashboard_widgets')
          .update({ sort_order: update.sort_order, updated_at: update.updated_at })
          .eq('id', update.id)

        if (error) throw error
      }

      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY })
    },
  })
}
