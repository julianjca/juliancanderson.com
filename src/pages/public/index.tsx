import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { createClient } from '@supabase/supabase-js'

interface PublicTask {
  id: string
  title: string
  status: string
}

interface PublicProject {
  id: string
  name: string
  color: string
  description?: string
}

interface PublicReadingItem {
  id: string
  title: string
  author?: string
  status: string
}

interface PublicNote {
  id: string
  title: string
  slug: string
  created_at: string
}

interface DashboardWidget {
  id: string
  widget_type: string
  title: string | null
  is_enabled: boolean
  sort_order: number
}

interface PublicStats {
  tasksCompleted: number
  notesPublished: number
  booksRead: number
}

interface PublicDashboardProps {
  widgets: DashboardWidget[]
  workingOn: PublicTask[]
  readingNow: PublicReadingItem[]
  recentNotes: PublicNote[]
  projects: PublicProject[]
  stats: PublicStats
}

export default function PublicDashboard({
  widgets,
  workingOn,
  readingNow,
  recentNotes,
  projects,
  stats,
}: PublicDashboardProps) {
  return (
    <>
      <Head>
        <title>What I'm Working On — Julian Anderson</title>
        <meta name="description" content="A live look at what I'm currently working on, reading, and thinking about." />
      </Head>

      <main className="public-dashboard">
        <header className="dashboard-header">
          <Link href="/" className="back-link">← Back to site</Link>
          <h1 className="dashboard-title">What I'm Working On</h1>
          <p className="dashboard-subtitle">A live look at my current projects, reading, and more</p>
        </header>

        <div className="widgets-grid">
          {widgets.filter(w => w.is_enabled).map((widget) => {
            switch (widget.widget_type) {
              case 'working_on':
                return (
                  <section key={widget.id} className="widget">
                    <h2 className="widget-title">{widget.title || 'Currently Working On'}</h2>
                    {workingOn.length === 0 ? (
                      <p className="widget-empty">Nothing marked as "in progress" right now</p>
                    ) : (
                      <ul className="task-list">
                        {workingOn.map((task) => (
                          <li key={task.id} className="task-item">
                            <span className="task-indicator" />
                            <span className="task-title">{task.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )

              case 'reading_now':
                return (
                  <section key={widget.id} className="widget">
                    <h2 className="widget-title">{widget.title || 'Currently Reading'}</h2>
                    {readingNow.length === 0 ? (
                      <p className="widget-empty">Not reading anything publicly shared right now</p>
                    ) : (
                      <ul className="reading-list">
                        {readingNow.map((book) => (
                          <li key={book.id} className="reading-item">
                            <span className="book-icon">📖</span>
                            <div className="book-info">
                              <span className="book-title">{book.title}</span>
                              {book.author && <span className="book-author">by {book.author}</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )

              case 'recent_notes':
                return (
                  <section key={widget.id} className="widget">
                    <h2 className="widget-title">{widget.title || 'Recent Notes'}</h2>
                    {recentNotes.length === 0 ? (
                      <p className="widget-empty">No public notes yet</p>
                    ) : (
                      <ul className="notes-list">
                        {recentNotes.map((note) => (
                          <li key={note.id} className="note-item">
                            <Link href={`/public/notes/${note.slug}`} className="note-link">
                              {note.title}
                            </Link>
                            <span className="note-date">
                              {new Date(note.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )

              case 'projects':
                return (
                  <section key={widget.id} className="widget">
                    <h2 className="widget-title">{widget.title || 'Projects'}</h2>
                    {projects.length === 0 ? (
                      <p className="widget-empty">No public projects</p>
                    ) : (
                      <ul className="projects-list">
                        {projects.map((project) => (
                          <li key={project.id} className="project-item">
                            <span className="project-dot" style={{ background: project.color }} />
                            <span className="project-name">{project.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )

              case 'stats':
                return (
                  <section key={widget.id} className="widget widget-stats">
                    <h2 className="widget-title">{widget.title || 'Stats'}</h2>
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="stat-value">{stats.tasksCompleted}</span>
                        <span className="stat-label">Tasks Done</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{stats.notesPublished}</span>
                        <span className="stat-label">Notes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{stats.booksRead}</span>
                        <span className="stat-label">Books Read</span>
                      </div>
                    </div>
                  </section>
                )

              default:
                return null
            }
          })}
        </div>

        {widgets.filter(w => w.is_enabled).length === 0 && (
          <div className="no-widgets">
            <p>Nothing to show here yet. Check back later!</p>
          </div>
        )}

        <footer className="dashboard-footer">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </footer>

        <style jsx>{`
          .public-dashboard {
            max-width: 720px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
          }
          .dashboard-header {
            margin-bottom: 3rem;
          }
          .back-link {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin-bottom: 1rem;
            display: inline-block;
          }
          .back-link:hover {
            color: var(--color-accent);
          }
          .dashboard-title {
            font-family: var(--font-display);
            font-size: 2rem;
            font-weight: 400;
            margin: 0.5rem 0 0.75rem;
          }
          .dashboard-subtitle {
            font-size: 1.0625rem;
            color: var(--color-text-secondary);
            margin: 0;
          }
          .widgets-grid {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .widget {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.5rem;
          }
          .widget-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0 0 1rem;
          }
          .widget-empty {
            font-size: 0.9375rem;
            color: var(--color-text-muted);
            margin: 0;
          }
          .task-list,
          .reading-list,
          .notes-list,
          .projects-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .task-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .task-item:last-child {
            border-bottom: none;
          }
          .task-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #f97316;
            flex-shrink: 0;
          }
          .task-title {
            font-size: 0.9375rem;
          }
          .reading-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.625rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .reading-item:last-child {
            border-bottom: none;
          }
          .book-icon {
            font-size: 1.25rem;
          }
          .book-info {
            flex: 1;
          }
          .book-title {
            display: block;
            font-size: 0.9375rem;
            font-weight: 500;
          }
          .book-author {
            display: block;
            font-size: 0.8125rem;
            color: var(--color-text-muted);
          }
          .note-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.625rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .note-item:last-child {
            border-bottom: none;
          }
          .note-link {
            font-size: 0.9375rem;
            color: var(--color-text);
          }
          .note-link:hover {
            color: var(--color-accent);
          }
          .note-date {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
          }
          .project-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
          }
          .project-dot {
            width: 10px;
            height: 10px;
            border-radius: 3px;
            flex-shrink: 0;
          }
          .project-name {
            font-size: 0.9375rem;
          }
          .widget-stats {
            background: var(--color-accent-subtle);
            border-color: var(--color-accent);
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            display: block;
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--color-accent);
          }
          .stat-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .no-widgets {
            text-align: center;
            padding: 3rem;
            color: var(--color-text-muted);
          }
          .dashboard-footer {
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--color-border-subtle);
            text-align: center;
          }
          .dashboard-footer p {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0;
          }
        `}</style>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<PublicDashboardProps> = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Return empty data if not configured
  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      props: {
        widgets: [],
        workingOn: [],
        readingNow: [],
        recentNotes: [],
        projects: [],
        stats: { tasksCompleted: 0, notesPublished: 0, booksRead: 0 },
      },
      revalidate: 300, // 5 minutes
    }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch enabled widgets
  const { data: widgets } = await supabase
    .from('dashboard_widgets')
    .select('*')
    .eq('is_enabled', true)
    .order('sort_order')

  // Fetch public tasks (Doing status)
  const { data: workingOn } = await supabase
    .from('tasks')
    .select('id, title, status')
    .eq('visibility', 'public')
    .eq('status', 'Doing')
    .limit(10)

  // Fetch public reading items (reading status)
  const { data: readingNow } = await supabase
    .from('reading_items')
    .select('id, title, author, status')
    .eq('visibility', 'public')
    .eq('status', 'reading')
    .limit(5)

  // Fetch public notes
  const { data: recentNotes } = await supabase
    .from('notes')
    .select('id, title, slug, created_at')
    .eq('visibility', 'public')
    .eq('note_type', 'note')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch public projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, color, description')
    .eq('visibility', 'public')
    .eq('status', 'active')
    .limit(5)

  // Calculate stats
  const { count: tasksCompleted } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('visibility', 'public')
    .eq('status', 'Done')

  const { count: notesPublished } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('visibility', 'public')
    .eq('note_type', 'note')

  const { count: booksRead } = await supabase
    .from('reading_items')
    .select('*', { count: 'exact', head: true })
    .eq('visibility', 'public')
    .eq('status', 'finished')

  return {
    props: {
      widgets: (widgets || []) as DashboardWidget[],
      workingOn: (workingOn || []) as PublicTask[],
      readingNow: (readingNow || []) as PublicReadingItem[],
      recentNotes: (recentNotes || []) as PublicNote[],
      projects: (projects || []) as PublicProject[],
      stats: {
        tasksCompleted: tasksCompleted || 0,
        notesPublished: notesPublished || 0,
        booksRead: booksRead || 0,
      },
    },
    revalidate: 300, // Regenerate every 5 minutes
  }
}
