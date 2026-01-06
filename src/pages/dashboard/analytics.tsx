import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import { useTasks } from '@/hooks/useTasks'
import { useNotes } from '@/hooks/useNotes'
import { useReadingSessions, useReadingStats, useReadingItems } from '@/hooks/useReading'

type Period = 'week' | 'month' | 'year'

export default function AnalyticsPage() {
  const [taskPeriod, setTaskPeriod] = useState<Period>('week')
  const { data: tasks = [] } = useTasks()
  const { data: notes = [] } = useNotes()
  const { data: readingSessions = [] } = useReadingSessions(undefined, 365)
  const { data: weekStats } = useReadingStats(7)
  const { data: monthStats } = useReadingStats(30)
  const { data: readingItems = [] } = useReadingItems()

  // Get date range for period
  const getDateRange = (period: Period) => {
    const now = new Date()
    const dates: string[] = []
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // Tasks completed by day
  const taskCompletionData = useMemo(() => {
    const dates = getDateRange(taskPeriod)
    const completedTasks = tasks.filter((t) => t.status === 'Done' && t.completed_at)

    return dates.map((date) => {
      const count = completedTasks.filter((t) => t.completed_at?.startsWith(date)).length
      return {
        date,
        label: taskPeriod === 'year'
          ? new Date(date).toLocaleDateString('en-US', { month: 'short' })
          : new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      }
    })
  }, [tasks, taskPeriod])

  // Aggregate for year view
  const aggregatedTaskData = useMemo(() => {
    if (taskPeriod !== 'year') return taskCompletionData

    const monthly: Record<string, number> = {}
    taskCompletionData.forEach((d) => {
      const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      monthly[month] = (monthly[month] || 0) + d.count
    })

    return Object.entries(monthly).map(([label, count]) => ({ label, count, date: '' }))
  }, [taskCompletionData, taskPeriod])

  const maxTasks = Math.max(...aggregatedTaskData.map((d) => d.count), 1)
  const totalCompleted = aggregatedTaskData.reduce((sum, d) => sum + d.count, 0)

  // Work in progress breakdown
  const wipBreakdown = useMemo(() => {
    const counts = {
      Backlog: tasks.filter((t) => t.status === 'Backlog').length,
      Next: tasks.filter((t) => t.status === 'Next').length,
      Doing: tasks.filter((t) => t.status === 'Doing').length,
      Blocked: tasks.filter((t) => t.status === 'Blocked').length,
      Done: tasks.filter((t) => t.status === 'Done').length,
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return { counts, total }
  }, [tasks])

  // Reading time by day (last 7 days)
  const readingByDay = useMemo(() => {
    const dates = getDateRange('week')
    return dates.map((date) => {
      const dayMinutes = readingSessions
        .filter((s) => s.session_date === date)
        .reduce((sum, s) => sum + (s.minutes_read || 0), 0)
      return {
        date,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: dayMinutes,
      }
    })
  }, [readingSessions])

  const maxReadingMinutes = Math.max(...readingByDay.map((d) => d.minutes), 1)

  // Notes by type
  const notesByType = useMemo(() => {
    return {
      note: notes.filter((n) => n.note_type === 'note').length,
      daily: notes.filter((n) => n.note_type === 'daily').length,
      weekly: notes.filter((n) => n.note_type === 'weekly').length,
    }
  }, [notes])

  // Daily note streak
  const dailyStreak = useMemo(() => {
    const dailyNotes = notes.filter((n) => n.note_type === 'daily').map((n) => n.note_date).filter(Boolean) as string[]
    if (dailyNotes.length === 0) return 0

    const sortedDates = Array.from(new Set(dailyNotes)).sort().reverse()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1])
      const curr = new Date(sortedDates[i])
      const diff = (prev.getTime() - curr.getTime()) / 86400000
      if (diff === 1) streak++
      else break
    }
    return streak
  }, [notes])

  // Reading streak
  const readingStreak = useMemo(() => {
    const dates = Array.from(new Set(readingSessions.map((s) => s.session_date))).sort().reverse()
    if (dates.length === 0) return 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (dates[0] !== today && dates[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (prev.getTime() - curr.getTime()) / 86400000
      if (diff === 1) streak++
      else break
    }
    return streak
  }, [readingSessions])

  return (
    <>
      <Head>
        <title>Analytics — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Analytics">
        <div className="analytics-grid">
          {/* Tasks Chart */}
          <div className="chart-card chart-card--wide">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Tasks Completed</h3>
                <span className="chart-subtitle">{totalCompleted} total</span>
              </div>
              <div className="chart-period">
                {(['week', 'month', 'year'] as Period[]).map((p) => (
                  <button
                    key={p}
                    className={`period-btn ${taskPeriod === p ? 'active' : ''}`}
                    onClick={() => setTaskPeriod(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-content">
              {totalCompleted === 0 ? (
                <div className="chart-empty">
                  <BarChartIcon />
                  <p>Complete tasks to see your progress</p>
                </div>
              ) : (
                <div className="bar-chart">
                  {(taskPeriod === 'week' ? aggregatedTaskData : aggregatedTaskData.slice(-12)).map((d, i) => (
                    <div key={i} className="bar-column">
                      <div className="bar-wrapper">
                        <div
                          className="bar"
                          style={{ height: `${(d.count / maxTasks) * 100}%` }}
                        />
                        {d.count > 0 && <span className="bar-value">{d.count}</span>}
                      </div>
                      <span className="bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* WIP Status */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Task Status</h3>
            </div>
            <div className="chart-content">
              {wipBreakdown.total === 0 ? (
                <div className="chart-empty">
                  <PieChartIcon />
                  <p>No tasks yet</p>
                </div>
              ) : (
                <div className="status-breakdown">
                  {Object.entries(wipBreakdown.counts).map(([status, count]) => {
                    const colors: Record<string, string> = {
                      Backlog: '#6b7280',
                      Next: '#3b82f6',
                      Doing: '#f97316',
                      Blocked: '#ef4444',
                      Done: '#22c55e',
                    }
                    const pct = Math.round((count / wipBreakdown.total) * 100)
                    return (
                      <div key={status} className="status-row">
                        <div className="status-info">
                          <span className="status-dot" style={{ background: colors[status] }} />
                          <span className="status-name">{status}</span>
                        </div>
                        <div className="status-bar-wrapper">
                          <div
                            className="status-bar"
                            style={{ width: `${pct}%`, background: colors[status] }}
                          />
                        </div>
                        <span className="status-count">{count}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Reading Stats */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Reading Time</h3>
            </div>
            <div className="chart-content">
              {!weekStats?.totalMinutes ? (
                <div className="chart-empty">
                  <TrendingIcon />
                  <p>Log reading sessions to track</p>
                </div>
              ) : (
                <div className="reading-stats">
                  <div className="reading-main-stat">
                    <span className="big-number">{weekStats.totalMinutes}</span>
                    <span className="big-label">minutes this week</span>
                  </div>
                  <div className="mini-bar-chart">
                    {readingByDay.map((d, i) => (
                      <div key={i} className="mini-bar-col">
                        <div
                          className="mini-bar"
                          style={{ height: `${(d.minutes / maxReadingMinutes) * 100}%` }}
                        />
                        <span className="mini-label">{d.label.charAt(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="reading-sub-stats">
                    <div className="sub-stat">
                      <span className="sub-value">{readingItems.filter((i) => i.status === 'reading').length}</span>
                      <span className="sub-label">Reading</span>
                    </div>
                    <div className="sub-stat">
                      <span className="sub-value">{readingItems.filter((i) => i.status === 'finished').length}</span>
                      <span className="sub-label">Finished</span>
                    </div>
                    <div className="sub-stat">
                      <span className="sub-value">{readingStreak}</span>
                      <span className="sub-label">Streak</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes Stats */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Notes</h3>
            </div>
            <div className="chart-content">
              {notes.length === 0 ? (
                <div className="chart-empty">
                  <ActivityIcon />
                  <p>Create notes to see activity</p>
                </div>
              ) : (
                <div className="notes-stats">
                  <div className="note-stat-row">
                    <span className="note-type-label">Notes</span>
                    <span className="note-type-count">{notesByType.note}</span>
                  </div>
                  <div className="note-stat-row">
                    <span className="note-type-label">Daily Notes</span>
                    <span className="note-type-count">{notesByType.daily}</span>
                  </div>
                  <div className="note-stat-row">
                    <span className="note-type-label">Weekly Reviews</span>
                    <span className="note-type-count">{notesByType.weekly}</span>
                  </div>
                  <div className="notes-total">
                    <span className="total-number">{notes.length}</span>
                    <span className="total-label">total notes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Streaks */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Streaks</h3>
            </div>
            <div className="chart-content">
              <div className="streaks-grid">
                <div className="streak-card">
                  <FlameIcon />
                  <span className="streak-value">{dailyStreak}</span>
                  <span className="streak-label">Daily Notes</span>
                </div>
                <div className="streak-card">
                  <BookIcon />
                  <span className="streak-value">{readingStreak}</span>
                  <span className="streak-label">Reading</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .analytics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .chart-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            overflow: hidden;
          }
          .chart-card--wide {
            grid-column: span 2;
          }
          .chart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .chart-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0;
          }
          .chart-subtitle {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .chart-period {
            display: flex;
            gap: 0.25rem;
          }
          .period-btn {
            font-size: 0.6875rem;
            font-weight: 500;
            color: var(--color-text-muted);
            background: transparent;
            border: none;
            border-radius: 4px;
            padding: 0.375rem 0.625rem;
            cursor: pointer;
          }
          .period-btn:hover {
            color: var(--color-text);
            background: var(--color-background-subtle);
          }
          .period-btn.active {
            color: var(--color-accent);
            background: var(--color-accent-subtle);
          }
          .chart-content {
            padding: 1.25rem;
          }
          .chart-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            color: var(--color-text-muted);
            text-align: center;
          }
          .chart-empty :global(svg) {
            width: 32px;
            height: 32px;
            margin-bottom: 0.75rem;
            opacity: 0.5;
          }
          .chart-empty p {
            font-size: 0.8125rem;
            margin: 0;
          }

          /* Bar Chart */
          .bar-chart {
            display: flex;
            align-items: flex-end;
            gap: 0.5rem;
            height: 120px;
          }
          .bar-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
          }
          .bar-wrapper {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            position: relative;
          }
          .bar {
            width: 100%;
            max-width: 32px;
            background: var(--color-accent);
            border-radius: 4px 4px 0 0;
            min-height: 2px;
            transition: height 0.3s ease;
          }
          .bar-value {
            position: absolute;
            bottom: 100%;
            font-size: 0.625rem;
            color: var(--color-text-muted);
            padding-bottom: 0.25rem;
          }
          .bar-label {
            font-size: 0.625rem;
            color: var(--color-text-muted);
            margin-top: 0.5rem;
          }

          /* Status Breakdown */
          .status-breakdown {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .status-row {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .status-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 80px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 2px;
          }
          .status-name {
            font-size: 0.75rem;
            color: var(--color-text-secondary);
          }
          .status-bar-wrapper {
            flex: 1;
            height: 6px;
            background: var(--color-background-subtle);
            border-radius: 3px;
            overflow: hidden;
          }
          .status-bar {
            height: 100%;
            transition: width 0.3s ease;
          }
          .status-count {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--color-text);
            width: 24px;
            text-align: right;
          }

          /* Reading Stats */
          .reading-stats {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .reading-main-stat {
            text-align: center;
          }
          .big-number {
            display: block;
            font-family: var(--font-display);
            font-size: 2.5rem;
            color: var(--color-text);
            line-height: 1;
          }
          .big-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .mini-bar-chart {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: 40px;
            gap: 0.25rem;
          }
          .mini-bar-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
          }
          .mini-bar {
            width: 100%;
            background: var(--color-accent);
            border-radius: 2px;
            min-height: 2px;
            margin-top: auto;
          }
          .mini-label {
            font-size: 0.5rem;
            color: var(--color-text-muted);
            margin-top: 0.25rem;
          }
          .reading-sub-stats {
            display: flex;
            justify-content: space-around;
            padding-top: 0.5rem;
            border-top: 1px solid var(--color-border-subtle);
          }
          .sub-stat {
            text-align: center;
          }
          .sub-value {
            display: block;
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--color-text);
          }
          .sub-label {
            font-size: 0.625rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }

          /* Notes Stats */
          .notes-stats {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .note-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .note-type-label {
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
          }
          .note-type-count {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-text);
          }
          .notes-total {
            text-align: center;
            margin-top: 0.5rem;
          }
          .total-number {
            display: block;
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--color-accent);
          }
          .total-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }

          /* Streaks */
          .streaks-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .streak-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--color-background);
            border-radius: 8px;
          }
          .streak-card :global(svg) {
            width: 24px;
            height: 24px;
            color: var(--color-accent);
          }
          .streak-value {
            font-family: var(--font-display);
            font-size: 2rem;
            line-height: 1;
            color: var(--color-text);
          }
          .streak-label {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }

          @media (max-width: 1024px) {
            .analytics-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .chart-card--wide {
              grid-column: span 2;
            }
          }
          @media (max-width: 640px) {
            .analytics-grid {
              grid-template-columns: 1fr;
            }
            .chart-card--wide {
              grid-column: span 1;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

function PieChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
