import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) return null

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createClient(req, res)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Get calendar connection
  const { data: connection, error: connError } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('owner_id', user.id)
    .eq('provider', 'google')
    .single()

  if (connError || !connection) {
    return res.status(401).json({ error: 'Calendar not connected' })
  }

  let accessToken = connection.access_token
  const tokenExpires = new Date(connection.token_expires_at)

  // Refresh token if needed
  if (tokenExpires.getTime() < Date.now() + 5 * 60 * 1000) {
    const newTokens = await refreshAccessToken(connection.refresh_token)
    if (!newTokens) {
      return res.status(401).json({ error: 'Failed to refresh token' })
    }

    accessToken = newTokens.access_token
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()

    await supabase
      .from('calendar_connections')
      .update({
        access_token: accessToken,
        token_expires_at: newExpiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', connection.id)
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    if (!response.ok) {
      return res.status(401).json({ error: 'Failed to fetch calendars' })
    }

    const data = await response.json()
    const calendars = (data.items || []).map((cal: Record<string, unknown>) => ({
      id: cal.id,
      name: cal.summary || cal.id,
      primary: cal.primary || false,
      backgroundColor: cal.backgroundColor,
    }))

    return res.json({ calendars })
  } catch (err) {
    console.error('Error fetching calendars:', err)
    return res.status(500).json({ error: 'Failed to fetch calendars' })
  }
}
