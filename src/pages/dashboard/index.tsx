import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DashboardLayout } from '@/components/Dashboard'
import { TaskModal } from '@/components/Dashboard/TaskModal'
import { useTasks, useCreateTask, type Task } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { useNotes, useCreateNote } from '@/hooks/useNotes'
import { useReadingItems, useReadingStats } from '@/hooks/useReading'

export default function DashboardPage() {
  const { data: tasks = [] } = useTasks()
  const { data: projects = [] } = useProjects('active')
  const { data: notes = [] } = useNotes()
  const { data: readingItems = [] } = useReadingItems('reading')
  const { data: weekStats } = useReadingStats(7)
  const createTask = useCreateTask()
  const createNote = useCreateNote()

  const [showTaskModal, setShowTaskModal] = useState(false)

  // Today's focus: tasks that are "Doing" or due today
  const todaysFocus = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks
      .filter((t) => t.status === 'Doing' || (t.due_date && t.due_date === today && t.status !== 'Done'))
      .slice(0, 3)
  }, [tasks])

  // Due soon: tasks due in next 7 days (excluding done)
  const dueSoon = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return tasks
      .filter((t) => {
        if (!t.due_date || t.status === 'Done') return false
        const dueDate = new Date(t.due_date)
        return dueDate >= today && dueDate <= weekEnd
      })
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5)
  }, [tasks])

  // Recent notes
  const recentNotes = useMemo(() => {
    return notes.filter((n) => n.note_type === 'note').slice(0, 4)
  }, [notes])

  const handleQuickNote = async () => {
    const note = await createNote.mutateAsync({ title: 'Untitled Note', note_type: 'note' })
    window.location.href = `/dashboard/notes?id=${note.id}`
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    await createTask.mutateAsync(taskData as Omit<Task, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'sort_order'>)
    setShowTaskModal(false)
  }

  return (
    <>
      <Head>
        <title>Dashboard — Julian Anderson</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Overview">
        <div className="overview-grid">
          {/* Quick Capture Widget */}
          <div className="widget widget--capture">
            <div className="widget-header">
              <h2 className="widget-title">Quick Capture</h2>
            </div>
            <div className="widget-content">
              <div className="capture-buttons">
                <button className="capture-btn" onClick={() => setShowTaskModal(true)}>
                  <PlusIcon />
                  <span>Task</span>
                </button>
                <button className="capture-btn" onClick={handleQuickNote}>
                  <PlusIcon />
                  <span>Note</span>
                </button>
                <Link href="/dashboard/reading" className="capture-btn">
                  <PlusIcon />
                  <span>Reading</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Focus Widget */}
          <div className="widget widget--focus">
            <div className="widget-header">
              <h2 className="widget-title">Today's Focus</h2>
              <span className="widget-badge">Top 3</span>
            </div>
            <div className="widget-content">
              {todaysFocus.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <SunIcon />
                  </div>
                  <p className="empty-text">No focus items for today</p>
                  <button className="empty-action" onClick={() => setShowTaskModal(true)}>
                    Set your focus
                  </button>
                </div>
              ) : (
                <div className="focus-list">
                  {todaysFocus.map((task) => (
                    <Link href={`/dashboard/tasks`} key={task.id} className="focus-item">
                      <span className="focus-status" style={{ background: task.status === 'Doing' ? '#f97316' : '#3b82f6' }} />
                      <span className="focus-title">{task.title}</span>
                      {task.due_date && (
                        <span className="focus-due">
                          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due Soon Widget */}
          <div className="widget widget--due">
            <div className="widget-header">
              <h2 className="widget-title">Due Soon</h2>
              <Link href="/dashboard/tasks" className="widget-link">View all →</Link>
            </div>
            <div className="widget-content">
              {dueSoon.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CheckIcon />
                  </div>
                  <p className="empty-text">All caught up!</p>
                </div>
              ) : (
                <div className="due-list">
                  {dueSoon.map((task) => {
                    const isOverdue = new Date(task.due_date!) < new Date()
                    return (
                      <div key={task.id} className={`due-item ${isOverdue ? 'overdue' : ''}`}>
                        <div className="due-info">
                          <span className="due-title">{task.title}</span>
                          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                            <CalendarIcon />
                            {new Date(task.due_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span className="due-status">{task.status}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Reading Progress Widget */}
          <div className="widget widget--reading">
            <div className="widget-header">
              <h2 className="widget-title">Reading</h2>
              <Link href="/dashboard/reading" className="widget-link">View all →</Link>
            </div>
            <div className="widget-content">
              {readingItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <BookIcon />
                  </div>
                  <p className="empty-text">No books in progress</p>
                  <Link href="/dashboard/reading" className="empty-action">Add a book</Link>
                </div>
              ) : (
                <div className="reading-widget">
                  <div className="reading-stats-mini">
                    <div className="stat-mini">
                      <span className="stat-mini-value">{readingItems.length}</span>
                      <span className="stat-mini-label">Reading</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-mini-value">{weekStats?.totalMinutes || 0}m</span>
                      <span className="stat-mini-label">This Week</span>
                    </div>
                  </div>
                  <div className="reading-list-mini">
                    {readingItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="reading-item-mini">
                        {item.cover_url ? (
                          <img src={item.cover_url} alt={item.title} className="reading-cover-mini" />
                        ) : (
                          <div className="reading-cover-placeholder-mini">
                            <BookIcon />
                          </div>
                        )}
                        <div className="reading-info-mini">
                          <span className="reading-title-mini">{item.title}</span>
                          {item.total_pages && (
                            <span className="reading-progress-mini">
                              {Math.round((item.current_page / item.total_pages) * 100)}% complete
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notes Widget */}
          <div className="widget widget--notes">
            <div className="widget-header">
              <h2 className="widget-title">Recent Notes</h2>
              <Link href="/dashboard/notes" className="widget-link">View all →</Link>
            </div>
            <div className="widget-content">
              {recentNotes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FileIcon />
                  </div>
                  <p className="empty-text">No notes yet</p>
                  <button className="empty-action" onClick={handleQuickNote}>Create a note</button>
                </div>
              ) : (
                <div className="notes-list-mini">
                  {recentNotes.map((note) => (
                    <Link href={`/dashboard/notes?id=${note.id}`} key={note.id} className="note-item-mini">
                      <span className="note-title-mini">{note.title}</span>
                      <span className="note-date-mini">
                        {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Projects Widget */}
          <div className="widget widget--projects">
            <div className="widget-header">
              <h2 className="widget-title">Active Projects</h2>
              <Link href="/dashboard/projects" className="widget-link">View all →</Link>
            </div>
            <div className="widget-content">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FolderIcon />
                  </div>
                  <p className="empty-text">No active projects</p>
                  <Link href="/dashboard/projects" className="empty-action">Create a project</Link>
                </div>
              ) : (
                <div className="projects-list-mini">
                  {projects.slice(0, 3).map((project) => {
                    const projectTasks = tasks.filter((t) => t.project_id === project.id)
                    const openTasks = projectTasks.filter((t) => t.status !== 'Done').length
                    return (
                      <Link href={`/dashboard/tasks?project=${project.id}`} key={project.id} className="project-item-mini">
                        <span className="project-color-mini" style={{ background: project.color }} />
                        <span className="project-name-mini">{project.name}</span>
                        <span className="project-count-mini">{openTasks} open</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {showTaskModal && (
          <TaskModal
            task={null}
            onSave={handleSaveTask}
            onClose={() => setShowTaskModal(false)}
          />
        )}

        <style jsx>{`
          .overview-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }

          .widget {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            overflow: hidden;
            animation: var(--animate-fade-in);
          }

          .widget--capture {
            grid-column: span 1;
          }

          .widget--focus {
            grid-column: span 2;
          }

          .widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }

          .widget-title {
            font-family: var(--font-body);
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-text);
            margin: 0;
            letter-spacing: 0.01em;
          }

          .widget-badge {
            font-size: 0.6875rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-accent);
            background: var(--color-accent-subtle);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
          }

          .widget-link {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            cursor: pointer;
            transition: color 0.15s ease;
            text-decoration: none;
          }

          .widget-link:hover {
            color: var(--color-accent);
          }

          .widget-content {
            padding: 1.25rem;
          }

          /* Capture buttons */
          .capture-buttons {
            display: flex;
            gap: 0.75rem;
          }

          .capture-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: var(--color-background);
            border: 1px dashed var(--color-border);
            border-radius: 8px;
            color: var(--color-text-secondary);
            font-size: 0.8125rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            text-decoration: none;
          }

          .capture-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
            background: var(--color-accent-subtle);
          }

          .capture-btn :global(svg) {
            width: 14px;
            height: 14px;
          }

          /* Empty states */
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem 1rem;
            text-align: center;
          }

          .empty-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: var(--color-background-subtle);
            border-radius: 12px;
            margin-bottom: 1rem;
            color: var(--color-text-muted);
          }

          .empty-icon :global(svg) {
            width: 24px;
            height: 24px;
          }

          .empty-text {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin: 0 0 0.75rem;
          }

          .empty-action {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-accent);
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            text-decoration: none;
          }

          .empty-action:hover {
            text-decoration: underline;
          }

          /* Focus list */
          .focus-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .focus-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--color-background);
            border-radius: 8px;
            text-decoration: none;
            transition: background 0.15s ease;
          }

          .focus-item:hover {
            background: var(--color-background-subtle);
          }

          .focus-status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .focus-title {
            flex: 1;
            font-size: 0.875rem;
            color: var(--color-text);
            font-weight: 500;
          }

          .focus-due {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }

          /* Due list */
          .due-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .due-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.625rem 0.75rem;
            background: var(--color-background);
            border-radius: 8px;
          }

          .due-item.overdue {
            background: rgba(239, 68, 68, 0.1);
          }

          .due-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .due-title {
            font-size: 0.8125rem;
            color: var(--color-text);
            font-weight: 500;
          }

          .due-date {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.6875rem;
            color: var(--color-text-muted);
          }

          .due-date.overdue {
            color: #ef4444;
          }

          .due-date :global(svg) {
            width: 10px;
            height: 10px;
          }

          .due-status {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            background: var(--color-background-subtle);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
          }

          /* Reading widget */
          .reading-widget {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .reading-stats-mini {
            display: flex;
            gap: 1.5rem;
          }

          .stat-mini {
            display: flex;
            flex-direction: column;
          }

          .stat-mini-value {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--color-text);
          }

          .stat-mini-label {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }

          .reading-list-mini {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .reading-item-mini {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .reading-cover-mini {
            width: 32px;
            height: 48px;
            object-fit: cover;
            border-radius: 4px;
          }

          .reading-cover-placeholder-mini {
            width: 32px;
            height: 48px;
            background: var(--color-background-subtle);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-muted);
          }

          .reading-cover-placeholder-mini :global(svg) {
            width: 14px;
            height: 14px;
          }

          .reading-info-mini {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
          }

          .reading-title-mini {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text);
          }

          .reading-progress-mini {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
          }

          /* Notes list */
          .notes-list-mini {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .note-item-mini {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.625rem 0.75rem;
            background: var(--color-background);
            border-radius: 8px;
            text-decoration: none;
            transition: background 0.15s ease;
          }

          .note-item-mini:hover {
            background: var(--color-background-subtle);
          }

          .note-title-mini {
            font-size: 0.8125rem;
            color: var(--color-text);
            font-weight: 500;
          }

          .note-date-mini {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
          }

          /* Projects list */
          .projects-list-mini {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .project-item-mini {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem 0.75rem;
            background: var(--color-background);
            border-radius: 8px;
            text-decoration: none;
            transition: background 0.15s ease;
          }

          .project-item-mini:hover {
            background: var(--color-background-subtle);
          }

          .project-color-mini {
            width: 10px;
            height: 10px;
            border-radius: 3px;
            flex-shrink: 0;
          }

          .project-name-mini {
            flex: 1;
            font-size: 0.8125rem;
            color: var(--color-text);
            font-weight: 500;
          }

          .project-count-mini {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
          }

          @media (max-width: 1024px) {
            .overview-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .widget--focus {
              grid-column: span 2;
            }
          }

          @media (max-width: 640px) {
            .overview-grid {
              grid-template-columns: 1fr;
            }

            .widget--focus {
              grid-column: span 1;
            }

            .capture-buttons {
              flex-direction: column;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

// Icon components
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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
