import React, { useState } from 'react'
import type { Task } from '@/hooks/useTasks'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task['status']) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const priorityColors = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#6b7280',
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done'

  return (
    <div className="task-card">
      <div className="task-header">
        {task.priority && (
          <span
            className="task-priority"
            style={{ background: priorityColors[task.priority] }}
            title={task.priority}
          />
        )}
        <button className="task-menu-btn" onClick={() => setShowMenu(!showMenu)}>
          <MoreIcon />
        </button>
        {showMenu && (
          <div className="task-menu">
            <button onClick={() => { onEdit(task); setShowMenu(false) }}>Edit</button>
            <button onClick={() => { onDelete(task.id); setShowMenu(false) }} className="danger">
              Delete
            </button>
          </div>
        )}
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        {task.due_date && (
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            <CalendarIcon />
            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="task-tag">{tag}</span>
            ))}
            {task.tags.length > 2 && <span className="task-tag">+{task.tags.length - 2}</span>}
          </div>
        )}
      </div>

      <style jsx>{`
        .task-card {
          background: var(--color-background-card);
          border: 1px solid var(--color-border-subtle);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: grab;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .task-card:hover {
          box-shadow: var(--shadow-card-hover);
        }
        .task-card:active {
          cursor: grabbing;
          transform: rotate(2deg);
        }
        .task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .task-priority {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .task-menu-btn {
          background: transparent;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          color: var(--color-text-muted);
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .task-card:hover .task-menu-btn {
          opacity: 1;
        }
        .task-menu-btn:hover {
          background: var(--color-background-subtle);
          color: var(--color-text);
        }
        .task-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--color-background-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          box-shadow: var(--shadow-card-hover);
          overflow: hidden;
          z-index: 10;
        }
        .task-menu button {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          font-size: 0.8125rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .task-menu button:hover {
          background: var(--color-background-subtle);
        }
        .task-menu button.danger {
          color: #ef4444;
        }
        .task-title {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.25rem;
          color: var(--color-text);
          line-height: 1.3;
        }
        .task-description {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin: 0 0 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .task-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .task-due {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          color: var(--color-text-muted);
        }
        .task-due.overdue {
          color: #ef4444;
        }
        .task-due :global(svg) {
          width: 12px;
          height: 12px;
        }
        .task-tags {
          display: flex;
          gap: 0.25rem;
        }
        .task-tag {
          font-size: 0.625rem;
          color: var(--color-text-muted);
          background: var(--color-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
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
