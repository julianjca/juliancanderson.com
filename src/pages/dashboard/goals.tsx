import React, { useState } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useGoalMilestones,
  useCreateMilestone,
  useToggleMilestone,
  useDeleteMilestone,
  type Goal,
  type GoalCategory,
  type GoalTimeframe,
  type GoalStatus,
} from '@/hooks/useGoals'

const CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: 'career', label: 'Career', emoji: '💼' },
  { value: 'health', label: 'Health', emoji: '💪' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'relationships', label: 'Relationships', emoji: '❤️' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'personal', label: 'Personal', emoji: '🌟' },
  { value: 'other', label: 'Other', emoji: '📌' },
]

const TIMEFRAMES: { value: GoalTimeframe; label: string }[] = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
]

export default function GoalsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<GoalTimeframe | ''>('')
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | ''>('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newMilestoneText, setNewMilestoneText] = useState('')

  const { data: goals = [] } = useGoals({
    status: showCompleted ? undefined : 'active',
    timeframe: selectedTimeframe || undefined,
    category: selectedCategory || undefined,
  })
  const { data: milestones = [] } = useGoalMilestones(selectedGoal?.id || '')

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const createMilestone = useCreateMilestone()
  const toggleMilestone = useToggleMilestone()
  const deleteMilestone = useDeleteMilestone()

  const handleCreateGoal = async () => {
    const newGoal = await createGoal.mutateAsync({
      title: 'New Goal',
      status: 'active',
    })
    setSelectedGoal(newGoal)
    setIsEditing(true)
  }

  const handleSaveGoal = async (updates: Partial<Goal>) => {
    if (!selectedGoal) return
    const updated = await updateGoal.mutateAsync({ id: selectedGoal.id, ...updates })
    setSelectedGoal(updated)
    setIsEditing(false)
  }

  const handleDeleteGoal = async (goal: Goal) => {
    if (confirm('Delete this goal?')) {
      await deleteGoal.mutateAsync(goal.id)
      if (selectedGoal?.id === goal.id) {
        setSelectedGoal(null)
      }
    }
  }

  const handleAddMilestone = async () => {
    if (!selectedGoal || !newMilestoneText.trim()) return
    await createMilestone.mutateAsync({
      goal_id: selectedGoal.id,
      title: newMilestoneText.trim(),
    })
    setNewMilestoneText('')
  }

  const completedMilestones = milestones.filter((m) => m.is_completed).length
  const totalMilestones = milestones.length
  const calculatedProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  return (
    <>
      <Head>
        <title>Goals — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Goals">
        <div className="goals-layout">
          <aside className="goals-sidebar">
            <div className="sidebar-header">
              <button className="new-goal-btn" onClick={handleCreateGoal}>
                <PlusIcon />
                <span>New Goal</span>
              </button>
            </div>

            <div className="sidebar-filters">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as GoalTimeframe | '')}
                className="filter-select"
              >
                <option value="">All Timeframes</option>
                {TIMEFRAMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as GoalCategory | '')}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>

              <label className="show-completed">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                />
                <span>Show Completed</span>
              </label>
            </div>

            <div className="goals-list">
              {goals.length === 0 ? (
                <p className="empty-text">No goals yet. Create your first goal!</p>
              ) : (
                goals.map((goal) => (
                  <button
                    key={goal.id}
                    className={`goal-item ${selectedGoal?.id === goal.id ? 'active' : ''} ${goal.status}`}
                    onClick={() => { setSelectedGoal(goal); setIsEditing(false) }}
                  >
                    <div className="goal-item-header">
                      <span className="goal-category-emoji">
                        {CATEGORIES.find((c) => c.value === goal.category)?.emoji || '📌'}
                      </span>
                      <span className="goal-item-title">{goal.title}</span>
                    </div>
                    <div className="goal-item-meta">
                      <span className="goal-progress-bar">
                        <span className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
                      </span>
                      <span className="goal-progress-text">{goal.progress}%</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className="goals-main">
            {selectedGoal ? (
              <GoalDetail
                goal={selectedGoal}
                milestones={milestones}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSaveGoal}
                onCancel={() => setIsEditing(false)}
                onDelete={() => handleDeleteGoal(selectedGoal)}
                onAddMilestone={handleAddMilestone}
                onToggleMilestone={(id, isCompleted) =>
                  toggleMilestone.mutate({ id, goal_id: selectedGoal.id, is_completed: isCompleted })
                }
                onDeleteMilestone={(id) =>
                  deleteMilestone.mutate({ id, goal_id: selectedGoal.id })
                }
                newMilestoneText={newMilestoneText}
                setNewMilestoneText={setNewMilestoneText}
                calculatedProgress={calculatedProgress}
              />
            ) : (
              <div className="goals-empty">
                <div className="empty-icon">
                  <TargetIcon />
                </div>
                <h3 className="empty-title">Set your goals</h3>
                <p className="empty-description">
                  Create goals to track your progress and stay motivated
                </p>
                <button className="empty-action" onClick={handleCreateGoal}>
                  Create your first goal
                </button>
              </div>
            )}
          </main>
        </div>

        <style jsx>{`
          .goals-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 1.5rem;
            min-height: calc(100vh - 200px);
          }
          .goals-sidebar {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1rem;
            height: fit-content;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
          .sidebar-header {
            margin-bottom: 1rem;
          }
          .new-goal-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            font-size: 0.875rem;
            font-weight: 500;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            padding: 0.625rem 1rem;
            cursor: pointer;
          }
          .new-goal-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .sidebar-filters {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .filter-select {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            background: var(--color-background);
          }
          .show-completed {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
            cursor: pointer;
          }
          .show-completed input {
            accent-color: var(--color-accent);
          }
          .goals-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .empty-text {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            text-align: center;
            padding: 1rem;
          }
          .goal-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
            padding: 0.75rem;
            background: transparent;
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            cursor: pointer;
            text-align: left;
          }
          .goal-item:hover {
            background: var(--color-background-subtle);
            border-color: var(--color-border);
          }
          .goal-item.active {
            background: var(--color-accent-subtle);
            border-color: var(--color-accent);
          }
          .goal-item.completed {
            opacity: 0.6;
          }
          .goal-item-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .goal-category-emoji {
            font-size: 1rem;
          }
          .goal-item-title {
            font-size: 0.875rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .goal-item-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .goal-progress-bar {
            flex: 1;
            height: 4px;
            background: var(--color-border);
            border-radius: 2px;
            overflow: hidden;
          }
          .goal-progress-fill {
            display: block;
            height: 100%;
            background: var(--color-accent);
            transition: width 0.3s ease;
          }
          .goal-progress-text {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            width: 32px;
            text-align: right;
          }
          .goals-main {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            min-height: 500px;
          }
          .goals-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 500px;
            text-align: center;
            padding: 3rem;
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
          @media (max-width: 768px) {
            .goals-layout {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

interface GoalDetailProps {
  goal: Goal
  milestones: { id: string; title: string; is_completed: boolean }[]
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<Goal>) => void
  onCancel: () => void
  onDelete: () => void
  onAddMilestone: () => void
  onToggleMilestone: (id: string, isCompleted: boolean) => void
  onDeleteMilestone: (id: string) => void
  newMilestoneText: string
  setNewMilestoneText: (text: string) => void
  calculatedProgress: number
}

function GoalDetail({
  goal,
  milestones,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  newMilestoneText,
  setNewMilestoneText,
  calculatedProgress,
}: GoalDetailProps) {
  const [title, setTitle] = useState(goal.title)
  const [description, setDescription] = useState(goal.description || '')
  const [category, setCategory] = useState<GoalCategory | ''>(goal.category || '')
  const [timeframe, setTimeframe] = useState<GoalTimeframe | ''>(goal.timeframe || '')
  const [status, setStatus] = useState<GoalStatus>(goal.status)
  const [targetDate, setTargetDate] = useState(goal.target_date || '')
  const [progress, setProgress] = useState(goal.progress)

  // Reset form when goal changes
  React.useEffect(() => {
    setTitle(goal.title)
    setDescription(goal.description || '')
    setCategory(goal.category || '')
    setTimeframe(goal.timeframe || '')
    setStatus(goal.status)
    setTargetDate(goal.target_date || '')
    setProgress(goal.progress)
  }, [goal])

  const handleSave = () => {
    onSave({
      title,
      description: description || null,
      category: category || null,
      timeframe: timeframe || null,
      status,
      target_date: targetDate || null,
      progress: milestones.length > 0 ? calculatedProgress : progress,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
  }

  const displayProgress = milestones.length > 0 ? calculatedProgress : progress

  return (
    <div className="goal-detail">
      <div className="detail-header">
        {isEditing ? (
          <input
            type="text"
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title"
          />
        ) : (
          <h2 className="detail-title">
            <span className="category-emoji">
              {CATEGORIES.find((c) => c.value === goal.category)?.emoji || '📌'}
            </span>
            {goal.title}
          </h2>
        )}

        <div className="detail-actions">
          {isEditing ? (
            <>
              <button className="action-btn" onClick={onCancel}>Cancel</button>
              <button className="action-btn primary" onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <button className="action-btn" onClick={onEdit}>Edit</button>
              <button className="action-btn danger" onClick={onDelete}>
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${displayProgress}%` }} />
        </div>
        <span className="progress-text">{displayProgress}% complete</span>
      </div>

      {isEditing ? (
        <div className="detail-form">
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as GoalCategory | '')}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Timeframe</label>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as GoalTimeframe | '')}>
                <option value="">Select timeframe</option>
                {TIMEFRAMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as GoalStatus)}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          {milestones.length === 0 && (
            <div className="form-group">
              <label>Manual Progress ({progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal..."
              rows={4}
            />
          </div>
        </div>
      ) : (
        <div className="detail-content">
          <div className="detail-meta">
            {goal.timeframe && (
              <span className="meta-item">{TIMEFRAMES.find((t) => t.value === goal.timeframe)?.label}</span>
            )}
            {goal.target_date && (
              <span className="meta-item">
                Due {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <span className={`status-badge ${goal.status}`}>{goal.status}</span>
          </div>

          {goal.description && (
            <p className="detail-description">{goal.description}</p>
          )}
        </div>
      )}

      <div className="milestones-section">
        <h3 className="milestones-title">Milestones</h3>

        <div className="add-milestone">
          <input
            type="text"
            className="milestone-input"
            value={newMilestoneText}
            onChange={(e) => setNewMilestoneText(e.target.value)}
            placeholder="Add a milestone..."
            onKeyDown={(e) => e.key === 'Enter' && onAddMilestone()}
          />
          <button className="add-milestone-btn" onClick={onAddMilestone} disabled={!newMilestoneText.trim()}>
            <PlusIcon />
          </button>
        </div>

        {milestones.length === 0 ? (
          <p className="no-milestones">No milestones yet. Add milestones to track progress automatically.</p>
        ) : (
          <ul className="milestones-list">
            {milestones.map((m) => (
              <li key={m.id} className={`milestone-item ${m.is_completed ? 'completed' : ''}`}>
                <label className="milestone-label">
                  <input
                    type="checkbox"
                    checked={m.is_completed}
                    onChange={(e) => onToggleMilestone(m.id, e.target.checked)}
                  />
                  <span className="milestone-text">{m.title}</span>
                </label>
                <button className="milestone-delete" onClick={() => onDeleteMilestone(m.id)}>
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .goal-detail {
          padding: 1.5rem;
        }
        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .detail-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0;
        }
        .category-emoji {
          font-size: 1.5rem;
        }
        .title-input {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          border: none;
          background: transparent;
          outline: none;
          flex: 1;
          margin-right: 1rem;
        }
        .detail-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-muted);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 0.375rem 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .action-btn:hover {
          color: var(--color-text);
        }
        .action-btn.primary {
          color: white;
          background: var(--color-accent);
          border-color: var(--color-accent);
        }
        .action-btn.danger:hover {
          color: #ef4444;
          border-color: #fecaca;
        }
        .action-btn :global(svg) {
          width: 14px;
          height: 14px;
        }
        .detail-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--color-accent);
          transition: width 0.3s ease;
        }
        .progress-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .detail-form {
          margin-bottom: 2rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: var(--color-background);
        }
        .form-group input[type="range"] {
          padding: 0;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }
        .detail-content {
          margin-bottom: 2rem;
        }
        .detail-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .meta-item {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .status-badge {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }
        .status-badge.paused {
          background: #fef3c7;
          color: #92400e;
        }
        .status-badge.completed {
          background: #dbeafe;
          color: #1e40af;
        }
        .status-badge.abandoned {
          background: #fee2e2;
          color: #991b1b;
        }
        .detail-description {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin: 0;
          white-space: pre-wrap;
        }
        .milestones-section {
          border-top: 1px solid var(--color-border-subtle);
          padding-top: 1.5rem;
        }
        .milestones-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--color-text-muted);
          margin: 0 0 1rem;
        }
        .add-milestone {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .milestone-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: var(--color-background);
        }
        .add-milestone-btn {
          padding: 0.5rem;
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .add-milestone-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .add-milestone-btn :global(svg) {
          width: 16px;
          height: 16px;
        }
        .no-milestones {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          margin: 0;
        }
        .milestones-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .milestone-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .milestone-item:last-child {
          border-bottom: none;
        }
        .milestone-item.completed {
          opacity: 0.6;
        }
        .milestone-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .milestone-label input {
          accent-color: var(--color-accent);
        }
        .milestone-text {
          font-size: 0.9375rem;
        }
        .milestone-item.completed .milestone-text {
          text-decoration: line-through;
        }
        .milestone-delete {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 0.25rem;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .milestone-item:hover .milestone-delete {
          opacity: 1;
        }
        .milestone-delete:hover {
          color: #ef4444;
        }
        .milestone-delete :global(svg) {
          width: 14px;
          height: 14px;
        }
      `}</style>
    </div>
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

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
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
