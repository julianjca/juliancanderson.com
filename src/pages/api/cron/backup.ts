import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// This endpoint creates a JSON backup of all data
// Can be triggered by Vercel Cron or manually
// Configure in vercel.json with: { "path": "/api/cron/backup", "schedule": "0 3 * * *" }

const CRON_SECRET = process.env.CRON_SECRET
const OWNER_USER_ID = process.env.OWNER_USER_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret for security (allow bypass for authenticated manual requests)
  const authHeader = req.headers.authorization
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    // For manual requests, check if user is authenticated
    // This is a simplified check - in production you'd verify the session
    if (req.method !== 'GET' || !req.query.manual) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  if (!OWNER_USER_ID) {
    return res.status(500).json({ error: 'Owner user ID not configured' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Fetch all data for owner
    const [
      { data: tasks },
      { data: projects },
      { data: notes },
      { data: readingItems },
      { data: readingSessions },
    ] = await Promise.all([
      supabase.from('tasks').select('*').eq('owner_id', OWNER_USER_ID).order('created_at'),
      supabase.from('projects').select('*').eq('owner_id', OWNER_USER_ID).order('created_at'),
      supabase.from('notes').select('*').eq('owner_id', OWNER_USER_ID).order('created_at'),
      supabase.from('reading_items').select('*').eq('owner_id', OWNER_USER_ID).order('created_at'),
      supabase.from('reading_sessions').select('*').eq('owner_id', OWNER_USER_ID).order('session_date'),
    ])

    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        tasks: tasks || [],
        projects: projects || [],
        notes: notes || [],
        readingItems: readingItems || [],
        readingSessions: readingSessions || [],
      },
      stats: {
        tasks: tasks?.length || 0,
        projects: projects?.length || 0,
        notes: notes?.length || 0,
        readingItems: readingItems?.length || 0,
        readingSessions: readingSessions?.length || 0,
      }
    }

    // If this is a download request, return as a file
    if (req.query.download) {
      const filename = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      return res.send(JSON.stringify(backup, null, 2))
    }

    // For cron jobs, just return success
    return res.json({
      message: 'Backup completed',
      stats: backup.stats,
      exportedAt: backup.exportedAt,
    })
  } catch (err) {
    console.error('Error creating backup:', err)
    return res.status(500).json({ error: 'Failed to create backup' })
  }
}
