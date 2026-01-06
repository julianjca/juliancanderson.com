import React, { useState, useEffect } from 'react'
import type { Task, RecurrenceRule } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'

interface TaskModalProps {
  task?: Task | null
  onSave: (task: Partial<Task>) => void
  onClose: () => void
}

export function TaskModal({ task, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<Task['status']>(task?.status || 'Backlog')
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || null)
  const [dueDate, setDueDate] = useState(task?.due_date || '')
  const [projectId, setProjectId] = useState(task?.project_id || '')
  const [tags, setTags] = useState(task?.tags?.join(', ') || '')
  const [visibility, setVisibility] = useState<Task['visibility']>(task?.visibility || 'private')
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | ''>(task?.recurrence_rule || '')

  const { data: projects } = useProjects('active')
  const isRecurringInstance = !!task?.recurrence_parent_id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      ...(task?.id && { id: task.id }),
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
      project_id: projectId || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      visibility,
      recurrence_rule: recurrenceRule || null,
    })
  }

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
                <option value="Backlog">Backlog</option>
                <option value="Next">Next</option>
                <option value="Doing">Doing</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={priority || ''} onChange={(e) => setPriority((e.target.value || null) as Task['priority'])}>
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="project">Project</label>
              <select id="project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">No Project</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags"
              />
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value as Task['visibility'])}>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
              </select>
              <span className="visibility-hint">
                {visibility === 'public' && 'Shown on public dashboard'}
                {visibility === 'unlisted' && 'Accessible via direct link'}
                {visibility === 'private' && 'Only you can see this'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recurrence">Repeat</label>
            <select
              id="recurrence"
              value={recurrenceRule}
              onChange={(e) => setRecurrenceRule(e.target.value as RecurrenceRule | '')}
              disabled={isRecurringInstance}
            >
              <option value="">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays (Mon-Fri)</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            {isRecurringInstance && (
              <span className="recurrence-hint">
                This is an instance of a recurring task
              </span>
            )}
            {recurrenceRule && !isRecurringInstance && (
              <span className="recurrence-hint">
                New instances created when this is completed
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{task ? 'Save' : 'Create'}</button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }
          .modal {
            background: var(--color-background-card);
            border-radius: 12px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.2s ease;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .modal-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0;
          }
          .modal-close {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
            border-radius: 4px;
          }
          .modal-close:hover {
            background: var(--color-background-subtle);
            color: var(--color-text);
          }
          .modal-form {
            padding: 1.5rem;
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
          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: var(--color-background);
            color: var(--color-text);
            font-family: var(--font-body);
          }
          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px var(--color-accent-subtle);
          }
          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .visibility-hint,
          .recurrence-hint {
            display: block;
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            margin-top: 0.25rem;
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
            font-weight: 500;
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-secondary:hover {
            border-color: var(--color-text-muted);
          }
          .btn-primary {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-primary:hover {
            background: var(--color-accent-hover);
          }
        `}</style>
      </div>
    </div>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
