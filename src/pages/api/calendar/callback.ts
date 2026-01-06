import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/calendar/callback`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, state, error } = req.query

  if (error) {
    console.error('OAuth error:', error)
    return res.redirect('/dashboard/settings?calendar_error=access_denied')
  }

  if (!code || typeof code !== 'string') {
    return res.redirect('/dashboard/settings?calendar_error=no_code')
  }

  // Verify user is authenticated and matches state
  const supabase = createClient(req, res)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.redirect('/login?redirect=/dashboard/settings')
  }

  if (state !== user.id) {
    return res.redirect('/dashboard/settings?calendar_error=state_mismatch')
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect('/dashboard/settings?calendar_error=not_configured')
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange error:', errorData)
      return res.redirect('/dashboard/settings?calendar_error=token_exchange')
    }

    const tokens = await tokenResponse.json()
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    // Store tokens in database
    const { error: dbError } = await supabase
      .from('calendar_connections')
      .upsert({
        owner_id: user.id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt,
        calendars_enabled: [], // Will be configured in settings
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'owner_id,provider',
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return res.redirect('/dashboard/settings?calendar_error=database')
    }

    // Redirect to settings with success
    return res.redirect('/dashboard/settings?calendar_connected=true')
  } catch (err) {
    console.error('Callback error:', err)
    return res.redirect('/dashboard/settings?calendar_error=unknown')
  }
}
