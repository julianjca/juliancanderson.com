import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null during build or if env vars not set
  if (!url || !key) {
    return null
  }

  // Singleton pattern to avoid creating multiple clients
  if (!client) {
    client = createBrowserClient(url, key)
  }

  return client
}
