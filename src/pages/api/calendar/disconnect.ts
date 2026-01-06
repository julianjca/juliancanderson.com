import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createClient(req, res)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Get connection to revoke token
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('access_token')
    .eq('owner_id', user.id)
    .eq('provider', 'google')
    .single()

  // Try to revoke the token with Google (best effort)
  if (connection?.access_token) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${connection.access_token}`, {
        method: 'POST',
      })
    } catch {
      // Ignore revocation errors - we'll delete locally anyway
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('calendar_connections')
    .delete()
    .eq('owner_id', user.id)
    .eq('provider', 'google')

  if (error) {
    console.error('Error disconnecting calendar:', error)
    return res.status(500).json({ error: 'Failed to disconnect' })
  }

  return res.json({ success: true })
}
