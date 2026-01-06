import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/calendar/callback`

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify user is authenticated
  const supabase = createClient(req, res)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Google Calendar integration not configured' })
  }

  // Generate OAuth URL
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh token
    state: user.id, // Pass user ID for verification in callback
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  res.redirect(authUrl)
}
