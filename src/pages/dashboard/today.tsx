import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DashboardLayout } from '@/components/Dashboard'
import { useDailyNote, useGetOrCreateDailyNote, useUpdateNote } from '@/hooks/useNotes'
import { useTasks, useUpdateTask, type Task } from '@/hooks/useTasks'
import { useCalendarEvents, useCalendarConnection, type CalendarEvent } from '@/hooks/useCalendar'

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [isEditing, setIsEditing] = useState(true)
  const [content, setContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { data: dailyNote, isLoading } = useDailyNote(selectedDate)
  const getOrCreateDailyNote = useGetOrCreateDailyNote()
  const updateNote = useUpdateNote()
  const { data: tasks = [] } = useTasks()
  const updateTask = useUpdateTask()

  // Calendar integration
  const { data: calendarConnection } = useCalendarConnection()
  const startOfDay = `${selectedDate}T00:00:00`
  const endOfDay = `${selectedDate}T23:59:59`
  const { data: calendarData } = useCalendarEvents(startOfDay, endOfDay)

  // Format date for display
  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  // Auto-create today's note
  useEffect(() => {
    if (!isLoading && !dailyNote && isToday) {
      getOrCreateDailyNote.mutate(selectedDate)
    }
  }, [selectedDate, dailyNote, isLoading, isToday])

  // Sync content with note
  useEffect(() => {
    if (dailyNote) {
      setContent(dailyNote.body_md)
      setHasUnsavedChanges(false)
    }
  }, [dailyNote?.id])

  // Filter tasks for selected date
  const todaysTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Show tasks that are "Doing" or due on selected date
      if (t.status === 'Done') return false
      if (t.status === 'Doing') return true
      if (t.due_date === selectedDate) return true
      return false
    })
  }, [tasks, selectedDate])

  // Save handler with debounce
  const handleSave = useCallback(async () => {
    if (!dailyNote || !hasUnsavedChanges) return
    await updateNote.mutateAsync({ id: dailyNote.id, body_md: content })
    setHasUnsavedChanges(false)
  }, [dailyNote, content, hasUnsavedChanges, updateNote])

  // Auto-save on content change
  useEffect(() => {
    if (!hasUnsavedChanges) return
    const timer = setTimeout(handleSave, 2000)
    return () => clearTimeout(timer)
  }, [content, hasUnsavedChanges, handleSave])

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate + 'T12:00:00')
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  // Toggle task completion
  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === 'Done' ? 'Next' : 'Done'
    await updateTask.mutateAsync({
      id: task.id,
      status: newStatus,
      completed_at: newStatus === 'Done' ? new Date().toISOString() : null
    })
  }

  // Format time for calendar events
  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.date) return 'All day'
    if (!event.start.dateTime) return ''
    const time = new Date(event.start.dateTime)
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <>
      <Head>
        <title>Today — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Today">
        <div className="date-nav">
          <button className="nav-btn" onClick={() => navigateDate('prev')}>
            <ChevronLeftIcon />
          </button>
          <div className="date-display">
            <span className="date-text">{formattedDate}</span>
            {!isToday && (
              <button className="today-btn" onClick={goToToday}>
                Go to today
              </button>
            )}
          </div>
          <button className="nav-btn" onClick={() => navigateDate('next')}>
            <ChevronRightIcon />
          </button>
        </div>

        <div className="today-layout">
          <section className="today-section">
            <div className="section-header">
              <h2 className="section-title">Daily Note</h2>
              <div className="section-actions">
                {hasUnsavedChanges && <span className="saving-indicator">Saving...</span>}
                <button
                  className={`section-btn ${isEditing ? 'active' : ''}`}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className={`section-btn ${!isEditing ? 'active' : ''}`}
                  onClick={() => setIsEditing(false)}
                >
                  Preview
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="note-loading">Loading daily note...</div>
            ) : !dailyNote && !isToday ? (
              <div className="note-empty">
                <p>No daily note for this date</p>
                <button
                  className="create-btn"
                  onClick={() => getOrCreateDailyNote.mutate(selectedDate)}
                >
                  Create Note
                </button>
              </div>
            ) : (
              <div className="note-editor">
                {isEditing ? (
                  <textarea
                    className="editor-textarea"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing..."
                  />
                ) : (
                  <div className="preview-content">
                    <MarkdownPreview content={content} />
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="today-sidebar">
            {/* Calendar Timeline */}
            <div className="sidebar-widget">
              <h3 className="sidebar-title">
                <CalendarIcon />
                Calendar
              </h3>
              {!calendarConnection ? (
                <div className="empty-list">
                  <p>No calendar connected</p>
                  <Link href="/dashboard/settings" className="connect-link">
                    Connect Google Calendar
                  </Link>
                </div>
              ) : calendarData?.needsAuth ? (
                <div className="empty-list">
                  <p>Calendar access expired</p>
                  <Link href="/dashboard/settings" className="connect-link">
                    Reconnect Calendar
                  </Link>
                </div>
              ) : !calendarData?.events || calendarData.events.length === 0 ? (
                <div className="empty-list">
                  <p>No events scheduled</p>
                </div>
              ) : (
                <div className="event-list">
                  {calendarData.events.map((event) => (
                    <div key={event.id} className="event-item">
                      <span className="event-time">{formatEventTime(event)}</span>
                      <span className="event-title">{event.summary}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="sidebar-widget">
              <h3 className="sidebar-title">
                {isToday ? "Today's Tasks" : 'Tasks'}
              </h3>
              {todaysTasks.length === 0 ? (
                <div className="empty-list">
                  <p>No tasks scheduled</p>
                </div>
              ) : (
                <div className="task-list">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <button
                        className={`task-check ${task.status === 'Done' ? 'checked' : ''}`}
                        onClick={() => handleToggleTask(task)}
                      >
                        {task.status === 'Done' && <CheckIcon />}
                      </button>
                      <div className="task-info">
                        <span className={`task-title ${task.status === 'Done' ? 'completed' : ''}`}>
                          {task.title}
                        </span>
                        <span className={`task-status ${task.status.toLowerCase()}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="sidebar-widget">
              <h3 className="sidebar-title">Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{tasks.filter((t) => t.status === 'Doing').length}</span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {tasks.filter((t) => t.status === 'Done' && t.completed_at?.startsWith(selectedDate)).length}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <style jsx>{`
          .date-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            cursor: pointer;
            color: var(--color-text-muted);
            transition: all 0.15s ease;
          }
          .nav-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
          }
          .nav-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .date-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
          }
          .date-text {
            font-family: var(--font-display);
            font-size: 1.125rem;
            color: var(--color-text);
          }
          .today-btn {
            font-size: 0.75rem;
            color: var(--color-accent);
            background: transparent;
            border: none;
            cursor: pointer;
          }
          .today-layout {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 2rem;
          }
          .today-section {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .section-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0;
          }
          .section-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .saving-indicator {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin-right: 0.5rem;
          }
          .section-btn {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-muted);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            padding: 0.375rem 0.75rem;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .section-btn:hover {
            border-color: var(--color-text-muted);
          }
          .section-btn.active {
            color: var(--color-accent);
            border-color: var(--color-accent);
            background: var(--color-accent-subtle);
          }
          .note-loading,
          .note-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            color: var(--color-text-muted);
            gap: 1rem;
          }
          .create-btn {
            font-size: 0.875rem;
            font-weight: 500;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }
          .note-editor {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .editor-textarea {
            flex: 1;
            min-height: 400px;
            padding: 1.25rem;
            font-family: var(--font-body);
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--color-text);
            background: transparent;
            border: none;
            resize: none;
          }
          .editor-textarea:focus {
            outline: none;
          }
          .editor-textarea::placeholder {
            color: var(--color-text-muted);
          }
          .preview-content {
            padding: 1.25rem;
            min-height: 400px;
          }
          .today-sidebar {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .sidebar-widget {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1rem 1.25rem;
          }
          .sidebar-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
            font-weight: 600;
            margin: 0 0 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .sidebar-title :global(svg) {
            width: 14px;
            height: 14px;
            color: var(--color-text-muted);
          }
          .empty-list {
            text-align: center;
            padding: 1rem 0;
          }
          .empty-list p {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0 0 0.5rem;
          }
          .connect-link {
            font-size: 0.75rem;
            color: var(--color-accent);
          }
          .event-list {
            display: flex;
            flex-direction: column;
            gap: 0.625rem;
          }
          .event-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.5rem 0.625rem;
            background: var(--color-background-subtle);
            border-radius: 6px;
          }
          .event-time {
            font-size: 0.6875rem;
            font-weight: 500;
            color: var(--color-text-muted);
            min-width: 50px;
            flex-shrink: 0;
          }
          .event-title {
            font-size: 0.8125rem;
            color: var(--color-text);
            flex: 1;
          }
          .task-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .task-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .task-check {
            width: 18px;
            height: 18px;
            border: 2px solid var(--color-border);
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
            transition: all 0.15s ease;
          }
          .task-check:hover {
            border-color: var(--color-accent);
          }
          .task-check.checked {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: white;
          }
          .task-check :global(svg) {
            width: 12px;
            height: 12px;
          }
          .task-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
          }
          .task-title {
            font-size: 0.8125rem;
            color: var(--color-text);
          }
          .task-title.completed {
            text-decoration: line-through;
            color: var(--color-text-muted);
          }
          .task-status {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
          }
          .task-status.doing {
            color: #f97316;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .stat-item {
            text-align: center;
          }
          .stat-value {
            display: block;
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--color-text);
          }
          .stat-label {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }
          @media (max-width: 1024px) {
            .today-layout {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

// Simple markdown preview component
function MarkdownPreview({ content }: { content: string }) {
  const html = useMemo(() => {
    // Basic markdown parsing
    let parsed = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

    return `<p>${parsed}</p>`
  }, [content])

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        lineHeight: 1.7,
        fontSize: '0.9375rem',
      }}
    />
  )
}

// Icons
function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
