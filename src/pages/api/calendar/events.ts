import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: { dateTime?: string; date?: string; timeZone?: string }
  end: { dateTime?: string; date?: string; timeZone?: string }
  location?: string
  htmlLink?: string
  calendarId: string
  calendarName?: string
  colorId?: string
}

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

  const { start, end } = req.query

  if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
    return res.status(400).json({ error: 'Missing start or end date' })
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
    return res.status(401).json({ error: 'Calendar not connected', needsAuth: true })
  }

  let accessToken = connection.access_token
  const tokenExpires = new Date(connection.token_expires_at)

  // Refresh token if expired or expiring soon (within 5 minutes)
  if (tokenExpires.getTime() < Date.now() + 5 * 60 * 1000) {
    const newTokens = await refreshAccessToken(connection.refresh_token)
    if (!newTokens) {
      return res.status(401).json({ error: 'Failed to refresh token', needsAuth: true })
    }

    accessToken = newTokens.access_token
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()

    // Update stored token
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
    // Fetch events from enabled calendars (or primary if none enabled)
    const calendarsToFetch = connection.calendars_enabled?.length > 0
      ? connection.calendars_enabled
      : ['primary']

    const allEvents: CalendarEvent[] = []

    for (const calendarId of calendarsToFetch) {
      const params = new URLSearchParams({
        timeMin: new Date(start).toISOString(),
        timeMax: new Date(end).toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '50',
      })

      const eventsResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        const events = (eventsData.items || []).map((event: Record<string, unknown>) => ({
          id: event.id,
          summary: event.summary || '(No title)',
          description: event.description,
          start: event.start,
          end: event.end,
          location: event.location,
          htmlLink: event.htmlLink,
          calendarId,
          colorId: event.colorId,
        }))
        allEvents.push(...events)
      }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date || ''
      const bStart = b.start.dateTime || b.start.date || ''
      return aStart.localeCompare(bStart)
    })

    return res.json({ events: allEvents })
  } catch (err) {
    console.error('Error fetching events:', err)
    return res.status(500).json({ error: 'Failed to fetch events' })
  }
}
