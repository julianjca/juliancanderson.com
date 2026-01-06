import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DashboardLayout } from '@/components/Dashboard'
import { useProjects, useCreateProject, useArchiveProject, useDeleteProject, type Project } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'

const colors = ['#6b7280', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived'>('active')
  const { data: projects = [], isLoading } = useProjects(statusFilter)
  const { data: allTasks = [] } = useTasks()
  const createProject = useCreateProject()
  const archiveProject = useArchiveProject()
  const deleteProject = useDeleteProject()

  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(colors[0])

  const getProjectStats = (projectId: string) => {
    const projectTasks = allTasks.filter((t) => t.project_id === projectId)
    const openTasks = projectTasks.filter((t) => t.status !== 'Done').length
    const completedTasks = projectTasks.filter((t) => t.status === 'Done').length
    return { openTasks, completedTasks, total: projectTasks.length }
  }

  const handleCreateProject = async () => {
    if (!newName.trim()) return
    await createProject.mutateAsync({ name: newName.trim(), color: newColor })
    setShowModal(false)
    setNewName('')
    setNewColor(colors[0])
  }

  const handleArchive = async (id: string) => {
    if (confirm('Archive this project?')) {
      await archiveProject.mutateAsync(id)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project? Tasks will be unlinked but not deleted.')) {
      await deleteProject.mutateAsync(id)
    }
  }

  return (
    <>
      <Head>
        <title>Projects — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Projects">
        <div className="projects-header">
          <div className="projects-tabs">
            <button
              className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`tab-btn ${statusFilter === 'archived' ? 'active' : ''}`}
              onClick={() => setStatusFilter('archived')}
            >
              Archived
            </button>
          </div>
          <button className="add-project-btn" onClick={() => setShowModal(true)}>
            <PlusIcon />
            <span>New Project</span>
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <div className="empty-icon">
              <FolderIcon />
            </div>
            <h3 className="empty-title">
              {statusFilter === 'active' ? 'No active projects' : 'No archived projects'}
            </h3>
            <p className="empty-description">
              {statusFilter === 'active' ? 'Create your first project to organize tasks and notes' : 'Archived projects will appear here'}
            </p>
            {statusFilter === 'active' && (
              <button className="empty-action" onClick={() => setShowModal(true)}>
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const stats = getProjectStats(project.id)
              return (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <span className="project-color" style={{ background: project.color }} />
                    <h3 className="project-name">{project.name}</h3>
                    <div className="project-actions">
                      <button onClick={() => handleArchive(project.id)} title="Archive">
                        <ArchiveIcon />
                      </button>
                      <button onClick={() => handleDelete(project.id)} title="Delete" className="danger">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  <div className="project-stats">
                    <div className="stat">
                      <span className="stat-value">{stats.openTasks}</span>
                      <span className="stat-label">Open</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{stats.completedTasks}</span>
                      <span className="stat-label">Done</span>
                    </div>
                    {stats.total > 0 && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(stats.completedTasks / stats.total) * 100}%`,
                            background: project.color,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <Link href={`/dashboard/tasks?project=${project.id}`} className="project-link">
                    View Tasks →
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">New Project</h2>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Project name"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colors.map((c) => (
                    <button
                      key={c}
                      className={`color-option ${newColor === c ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setNewColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreateProject}>Create</button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .projects-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          .projects-tabs {
            display: flex;
            gap: 0.25rem;
            background: var(--color-background-subtle);
            padding: 0.25rem;
            border-radius: 8px;
          }
          .tab-btn {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-muted);
            background: transparent;
            border: none;
            border-radius: 6px;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }
          .tab-btn:hover {
            color: var(--color-text);
          }
          .tab-btn.active {
            color: var(--color-text);
            background: var(--color-background-card);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .add-project-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            padding: 0.625rem 1rem;
            cursor: pointer;
          }
          .add-project-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .loading {
            text-align: center;
            padding: 3rem;
            color: var(--color-text-muted);
          }
          .projects-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            background: var(--color-background-card);
            border: 1px dashed var(--color-border);
            border-radius: 12px;
            text-align: center;
          }
          .empty-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: var(--color-background-subtle);
            border-radius: 16px;
            margin-bottom: 1.5rem;
            color: var(--color-text-muted);
          }
          .empty-icon :global(svg) {
            width: 32px;
            height: 32px;
          }
          .empty-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 400;
            margin: 0 0 0.5rem;
          }
          .empty-description {
            font-size: 0.9375rem;
            color: var(--color-text-muted);
            margin: 0 0 1.5rem;
          }
          .empty-action {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-accent);
            background: var(--color-accent-subtle);
            border: none;
            border-radius: 8px;
            padding: 0.625rem 1.25rem;
            cursor: pointer;
          }
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
          }
          .project-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
          }
          .project-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }
          .project-color {
            width: 12px;
            height: 12px;
            border-radius: 4px;
            flex-shrink: 0;
          }
          .project-name {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            flex: 1;
          }
          .project-actions {
            display: flex;
            gap: 0.25rem;
            opacity: 0;
            transition: opacity 0.15s ease;
          }
          .project-card:hover .project-actions {
            opacity: 1;
          }
          .project-actions button {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
            border-radius: 4px;
          }
          .project-actions button:hover {
            background: var(--color-background-subtle);
            color: var(--color-text);
          }
          .project-actions button.danger:hover {
            color: #ef4444;
          }
          .project-actions :global(svg) {
            width: 14px;
            height: 14px;
          }
          .project-description {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin: 0 0 1rem;
          }
          .project-stats {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            display: block;
            font-size: 1.25rem;
            font-weight: 600;
          }
          .stat-label {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }
          .progress-bar {
            flex: 1;
            height: 4px;
            background: var(--color-background-subtle);
            border-radius: 2px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
          }
          .project-link {
            font-size: 0.8125rem;
            color: var(--color-accent);
          }
          .project-link:hover {
            text-decoration: underline;
          }
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal {
            background: var(--color-background-card);
            border-radius: 12px;
            padding: 1.5rem;
            width: 100%;
            max-width: 400px;
          }
          .modal-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            margin: 0 0 1.5rem;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .form-group label {
            display: block;
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-secondary);
            margin-bottom: 0.375rem;
          }
          .form-group input {
            width: 100%;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: var(--color-background);
          }
          .form-group input:focus {
            outline: none;
            border-color: var(--color-accent);
          }
          .color-picker {
            display: flex;
            gap: 0.5rem;
          }
          .color-option {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: 2px solid transparent;
            cursor: pointer;
          }
          .color-option.active {
            border-color: var(--color-text);
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .btn-secondary {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-primary {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
