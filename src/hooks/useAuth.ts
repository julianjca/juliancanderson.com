import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Skip if Supabase client not available (during build or missing env vars)
    if (!supabase) {
      setState({ user: null, session: null, loading: false })
      return
    }

    // Get initial session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      setState({
        user: data.session?.user ?? null,
        session: data.session,
        loading: false,
      })
    }
    initSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      setState({
        user: newSession?.user ?? null,
        session: newSession,
        loading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    if (!supabase) {
      router.push('/login')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    router.push('/login')
  }, [router, supabase])

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signIn,
    signOut,
  }
}
