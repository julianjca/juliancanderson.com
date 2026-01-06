import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// This endpoint generates instances for recurring tasks
// Can be triggered by Vercel Cron or manually
// Configure in vercel.json with: { "path": "/api/cron/generate-recurring-tasks", "schedule": "0 6 * * *" }

const CRON_SECRET = process.env.CRON_SECRET

type RecurrenceRule = 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

function calculateNextDate(rule: RecurrenceRule, fromDate: Date): Date {
  const result = new Date(fromDate)

  switch (rule) {
    case 'daily':
      result.setDate(result.getDate() + 1)
      break
    case 'weekdays':
      result.setDate(result.getDate() + 1)
      // Skip weekends
      while (result.getDay() === 0 || result.getDay() === 6) {
        result.setDate(result.getDate() + 1)
      }
      break
    case 'weekly':
      result.setDate(result.getDate() + 7)
      break
    case 'biweekly':
      result.setDate(result.getDate() + 14)
      break
    case 'monthly':
      result.setMonth(result.getMonth() + 1)
      break
    case 'quarterly':
      result.setMonth(result.getMonth() + 3)
      break
    case 'yearly':
      result.setFullYear(result.getFullYear() + 1)
      break
  }

  return result
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const today = new Date()
  const todayStr = formatDate(today)

  try {
    // Find recurring tasks that need new instances
    // Either: recurrence_next_at <= today, or they're completed with a recurrence rule
    const { data: recurringTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .not('recurrence_rule', 'is', null)
      .is('recurrence_parent_id', null) // Only parent tasks, not instances
      .or(`recurrence_next_at.lte.${todayStr},and(status.eq.Done,recurrence_next_at.is.null)`)

    if (fetchError) throw fetchError

    if (!recurringTasks || recurringTasks.length === 0) {
      return res.json({ message: 'No recurring tasks need processing', created: 0 })
    }

    let created = 0
    const errors: string[] = []

    for (const task of recurringTasks) {
      try {
        // Calculate the due date for the new instance
        const baseDate = task.due_date ? new Date(task.due_date) : today
        const nextDueDate = calculateNextDate(task.recurrence_rule as RecurrenceRule, baseDate)

        // Create new task instance
        const { error: insertError } = await supabase.from('tasks').insert({
          owner_id: task.owner_id,
          title: task.title,
          description: task.description,
          status: 'Backlog', // New instances start in Backlog
          priority: task.priority,
          due_date: formatDate(nextDueDate),
          project_id: task.project_id,
          tags: task.tags,
          visibility: task.visibility,
          recurrence_parent_id: task.id, // Link to parent
          sort_order: 0,
        })

        if (insertError) {
          errors.push(`Failed to create instance for task ${task.id}: ${insertError.message}`)
          continue
        }

        // Update parent task's next recurrence date
        const nextNextDate = calculateNextDate(task.recurrence_rule as RecurrenceRule, nextDueDate)
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ recurrence_next_at: formatDate(nextNextDate) })
          .eq('id', task.id)

        if (updateError) {
          errors.push(`Failed to update next date for task ${task.id}: ${updateError.message}`)
        }

        created++
      } catch (err) {
        errors.push(`Error processing task ${task.id}: ${err}`)
      }
    }

    return res.json({
      message: `Generated ${created} recurring task instances`,
      created,
      processed: recurringTasks.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('Error generating recurring tasks:', err)
    return res.status(500).json({ error: 'Failed to generate recurring tasks' })
  }
}
