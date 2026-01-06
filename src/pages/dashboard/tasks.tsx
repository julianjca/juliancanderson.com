import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import { TaskCard } from '@/components/Dashboard/TaskCard'
import { TaskModal } from '@/components/Dashboard/TaskModal'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, type Task } from '@/hooks/useTasks'

const columns: { id: Task['status']; name: string; color: string }[] = [
  { id: 'Backlog', name: 'Backlog', color: '#6b7280' },
  { id: 'Next', name: 'Next', color: '#3b82f6' },
  { id: 'Doing', name: 'Doing', color: '#f97316' },
  { id: 'Blocked', name: 'Blocked', color: '#ef4444' },
  { id: 'Done', name: 'Done', color: '#22c55e' },
]

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all')

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return tasks.filter((task) => {
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)

      if (filter === 'today') {
        return dueDate.toDateString() === today.toDateString()
      }
      if (filter === 'week') {
        return dueDate >= today && dueDate <= weekEnd
      }
      return true
    })
  }, [tasks, filter])

  const tasksByStatus = useMemo(() => {
    const grouped: Record<Task['status'], Task[]> = {
      Backlog: [],
      Next: [],
      Doing: [],
      Blocked: [],
      Done: [],
    }

    filteredTasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    // Sort each column by sort_order
    Object.keys(grouped).forEach((status) => {
      grouped[status as Task['status']].sort((a, b) => a.sort_order - b.sort_order)
    })

    return grouped
  }, [filteredTasks])

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (taskData.id) {
      await updateTask.mutateAsync(taskData as Task)
    } else {
      await createTask.mutateAsync(taskData as Omit<Task, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'sort_order'>)
    }
    setShowModal(false)
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleDeleteTask = async (id: string) => {
    if (confirm('Delete this task?')) {
      await deleteTask.mutateAsync(id)
    }
  }

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const completedAt = status === 'Done' ? new Date().toISOString() : null
    await updateTask.mutateAsync({ id, status, completed_at: completedAt })
  }

  return (
    <>
      <Head>
        <title>Tasks — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Tasks">
        <div className="tasks-header">
          <div className="tasks-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button
              className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              This Week
            </button>
          </div>
          <button className="add-task-btn" onClick={() => { setEditingTask(null); setShowModal(true) }}>
            <PlusIcon />
            <span>Add Task</span>
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="kanban-board">
            {columns.map((column) => (
              <div key={column.id} className="kanban-column">
                <div className="column-header">
                  <span className="column-dot" style={{ background: column.color }} />
                  <h3 className="column-title">{column.name}</h3>
                  <span className="column-count">{tasksByStatus[column.id].length}</span>
                </div>
                <div className="column-content">
                  {tasksByStatus[column.id].length === 0 ? (
                    <div className="empty-column">
                      <p>No tasks</p>
                    </div>
                  ) : (
                    <div className="task-list">
                      {tasksByStatus[column.id].map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <TaskModal
            task={editingTask}
            onSave={handleSaveTask}
            onClose={() => { setShowModal(false); setEditingTask(null) }}
          />
        )}

        <style jsx>{`
          .tasks-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
          }
          .tasks-filters {
            display: flex;
            gap: 0.5rem;
          }
          .filter-btn {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-muted);
            background: transparent;
            border: 1px solid transparent;
            border-radius: 6px;
            padding: 0.5rem 0.875rem;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .filter-btn:hover {
            color: var(--color-text);
            background: var(--color-background-subtle);
          }
          .filter-btn.active {
            color: var(--color-accent);
            background: var(--color-accent-subtle);
            border-color: var(--color-accent-subtle);
          }
          .add-task-btn {
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
            transition: background 0.15s ease;
          }
          .add-task-btn:hover {
            background: var(--color-accent-hover);
          }
          .add-task-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .loading {
            text-align: center;
            padding: 3rem;
            color: var(--color-text-muted);
          }
          .kanban-board {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1rem;
            overflow-x: auto;
          }
          .kanban-column {
            background: var(--color-background-subtle);
            border-radius: 12px;
            min-width: 220px;
            display: flex;
            flex-direction: column;
          }
          .column-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
          }
          .column-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .column-title {
            font-size: 0.8125rem;
            font-weight: 600;
            margin: 0;
            flex: 1;
          }
          .column-count {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            background: var(--color-background-card);
            padding: 0.125rem 0.5rem;
            border-radius: 4px;
          }
          .column-content {
            flex: 1;
            padding: 0 0.75rem 0.75rem;
            min-height: 200px;
          }
          .empty-column {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--color-text-muted);
            font-size: 0.8125rem;
          }
          .task-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          @media (max-width: 1200px) {
            .kanban-board {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 768px) {
            .kanban-board {
              grid-template-columns: 1fr;
            }
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
