import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Project {
  id: string
  owner_id: string
  name: string
  description: string | null
  color: string
  status: 'active' | 'archived'
  tags: string[]
  visibility: 'private' | 'unlisted' | 'public'
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type ProjectInsert = Omit<Project, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'archived_at'>
export type ProjectUpdate = Partial<ProjectInsert> & { id: string }

const PROJECTS_KEY = ['projects']

export function useProjects(status?: 'active' | 'archived') {
  const supabase = createClient()

  return useQuery({
    queryKey: [...PROJECTS_KEY, status],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Project[]
    },
    enabled: !!supabase,
  })
}

export function useProject(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...PROJECTS_KEY, id],
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Project
    },
    enabled: !!supabase && !!id,
  })
}

export function useCreateProject() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (project: Partial<ProjectInsert>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name || 'Untitled Project',
          description: project.description || null,
          color: project.color || '#6b7280',
          status: project.status || 'active',
          tags: project.tags || [],
          visibility: project.visibility || 'private',
        })
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
    },
  })
}

export function useUpdateProject() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ProjectUpdate) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
    },
  })
}

export function useArchiveProject() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('projects')
        .update({ status: 'archived', archived_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
    },
  })
}

export function useDeleteProject() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
    },
  })
}
