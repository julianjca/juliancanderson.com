import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// This endpoint is called by Vercel Cron on Sunday evenings
// Configure in vercel.json with: { "path": "/api/cron/weekly-review", "schedule": "0 18 * * 0" }

const CRON_SECRET = process.env.CRON_SECRET
const OWNER_USER_ID = process.env.OWNER_USER_ID

// Weekly review template
const WEEKLY_REVIEW_TEMPLATE = `# Weekly Review

## What went well this week?


## What didn't work?


## What did I learn?


## Focus for next week


## Backlog Grooming
- [ ] Review tasks in Backlog
- [ ] Archive stale items
- [ ] Update priorities

---

## Automatic Rollups

*Stats will be populated when you save the review.*
`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!OWNER_USER_ID) {
    return res.status(500).json({ error: 'Owner user ID not configured' })
  }

  // Use service role for cron jobs
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Get current week's Sunday date
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay()) // Go to Sunday
    const weekDate = weekStart.toISOString().split('T')[0]

    // Check if weekly review already exists
    const { data: existing } = await supabase
      .from('notes')
      .select('id')
      .eq('owner_id', OWNER_USER_ID)
      .eq('note_type', 'weekly')
      .eq('date', weekDate)
      .single()

    if (existing) {
      return res.json({ message: 'Weekly review already exists', noteId: existing.id })
    }

    // Gather stats for the week
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekEndStr = weekEnd.toISOString().split('T')[0]

    // Get tasks completed this week
    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('owner_id', OWNER_USER_ID)
      .eq('status', 'Done')
      .gte('completed_at', `${weekDate}T00:00:00`)
      .lt('completed_at', `${weekEndStr}T00:00:00`)

    // Get current WIP tasks
    const { data: wipTasks } = await supabase
      .from('tasks')
      .select('id, status')
      .eq('owner_id', OWNER_USER_ID)
      .in('status', ['Doing', 'Blocked'])

    // Get notes created this week
    const { data: notesCreated } = await supabase
      .from('notes')
      .select('id')
      .eq('owner_id', OWNER_USER_ID)
      .gte('created_at', `${weekDate}T00:00:00`)
      .lt('created_at', `${weekEndStr}T00:00:00`)

    // Get reading sessions this week
    const { data: readingSessions } = await supabase
      .from('reading_sessions')
      .select('minutes_read, pages_read')
      .eq('owner_id', OWNER_USER_ID)
      .gte('session_date', weekDate)
      .lt('session_date', weekEndStr)

    const totalMinutes = readingSessions?.reduce((sum, s) => sum + (s.minutes_read || 0), 0) || 0
    const totalPages = readingSessions?.reduce((sum, s) => sum + (s.pages_read || 0), 0) || 0

    // Build stats section
    const statsSection = `
### This Week's Stats
- **Tasks completed:** ${completedTasks?.length || 0}
- **Tasks in progress:** ${wipTasks?.filter(t => t.status === 'Doing').length || 0}
- **Tasks blocked:** ${wipTasks?.filter(t => t.status === 'Blocked').length || 0}
- **Notes created:** ${notesCreated?.length || 0}
- **Reading:** ${totalMinutes} minutes, ${totalPages} pages
`

    // Create the weekly review note
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        owner_id: OWNER_USER_ID,
        title: `Weekly Review - Week of ${new Date(weekDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        body_md: WEEKLY_REVIEW_TEMPLATE + statsSection,
        note_type: 'weekly',
        date: weekDate,
        is_pinned: false,
        tags: ['weekly-review'],
      })
      .select()
      .single()

    if (error) throw error

    return res.json({
      message: 'Weekly review created',
      noteId: note.id,
      stats: {
        tasksCompleted: completedTasks?.length || 0,
        tasksInProgress: wipTasks?.filter(t => t.status === 'Doing').length || 0,
        tasksBlocked: wipTasks?.filter(t => t.status === 'Blocked').length || 0,
        notesCreated: notesCreated?.length || 0,
        readingMinutes: totalMinutes,
        readingPages: totalPages,
      }
    })
  } catch (err) {
    console.error('Error creating weekly review:', err)
    return res.status(500).json({ error: 'Failed to create weekly review' })
  }
}
