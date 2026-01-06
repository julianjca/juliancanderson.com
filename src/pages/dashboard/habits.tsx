import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useHabitLogsForRange,
  useLogHabit,
  useUnlogHabit,
  type Habit,
  type HabitFrequency,
} from '@/hooks/useHabits'

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'weekly', label: 'Weekly' },
]

const COLORS = [
  '#f97316', '#ef4444', '#ec4899', '#8b5cf6',
  '#3b82f6', '#06b6d4', '#10b981', '#84cc16',
]

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay()) // Start from Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

export default function HabitsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [showNewHabitForm, setShowNewHabitForm] = useState(false)

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
  const startDate = getDateString(weekDates[0])
  const endDate = getDateString(weekDates[6])

  const { data: habits = [] } = useHabits()
  const { data: logs = [] } = useHabitLogsForRange(startDate, endDate)

  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()
  const deleteHabit = useDeleteHabit()
  const logHabit = useLogHabit()
  const unlogHabit = useUnlogHabit()

  const logsByHabitAndDate = useMemo(() => {
    const map: Record<string, Record<string, boolean>> = {}
    logs.forEach((log) => {
      if (!map[log.habit_id]) map[log.habit_id] = {}
      map[log.habit_id][log.log_date] = true
    })
    return map
  }, [logs])

  const isCompleted = (habitId: string, date: Date) => {
    const dateStr = getDateString(date)
    return logsByHabitAndDate[habitId]?.[dateStr] || false
  }

  const toggleHabit = async (habit: Habit, date: Date) => {
    const dateStr = getDateString(date)
    if (isCompleted(habit.id, date)) {
      await unlogHabit.mutateAsync({ habit_id: habit.id, log_date: dateStr })
    } else {
      await logHabit.mutateAsync({ habit_id: habit.id, log_date: dateStr })
    }
  }

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const today = getDateString(new Date())
  const completedToday = habits.filter((h) => isCompleted(h.id, new Date())).length

  return (
    <>
      <Head>
        <title>Habits — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Habits">
        <div className="habits-page">
          <div className="habits-header">
            <div className="header-left">
              <h2 className="today-summary">
                {completedToday}/{habits.length} completed today
              </h2>
            </div>
            <div className="header-right">
              <button className="new-habit-btn" onClick={() => setShowNewHabitForm(true)}>
                <PlusIcon />
                <span>New Habit</span>
              </button>
            </div>
          </div>

          <div className="week-navigation">
            <button className="nav-btn" onClick={handlePrevWeek}>
              <ChevronLeftIcon />
            </button>
            <button className="nav-btn today-btn" onClick={handleToday}>
              Today
            </button>
            <button className="nav-btn" onClick={handleNextWeek}>
              <ChevronRightIcon />
            </button>
          </div>

          <div className="habits-grid">
            <div className="grid-header">
              <div className="habit-name-header">Habit</div>
              {weekDates.map((date) => (
                <div
                  key={date.toISOString()}
                  className={`day-header ${getDateString(date) === today ? 'today' : ''}`}
                >
                  <span className="day-name">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="day-number">{date.getDate()}</span>
                </div>
              ))}
              <div className="streak-header">Streak</div>
            </div>

            {habits.length === 0 ? (
              <div className="empty-habits">
                <p>No habits yet. Create your first habit to start tracking!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="habit-row">
                  <button
                    className="habit-name"
                    onClick={() => setEditingHabit(habit)}
                  >
                    <span className="habit-emoji">{habit.emoji}</span>
                    <span className="habit-label">{habit.name}</span>
                  </button>

                  {weekDates.map((date) => {
                    const completed = isCompleted(habit.id, date)
                    const dateStr = getDateString(date)
                    const isToday = dateStr === today
                    const isFuture = dateStr > today

                    return (
                      <button
                        key={date.toISOString()}
                        className={`day-cell ${completed ? 'completed' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
                        onClick={() => !isFuture && toggleHabit(habit, date)}
                        disabled={isFuture}
                        style={{ '--habit-color': habit.color } as React.CSSProperties}
                      >
                        {completed && <CheckIcon />}
                      </button>
                    )
                  })}

                  <div className="streak-cell">
                    {habit.current_streak > 0 ? (
                      <span className="streak-count">
                        <FlameIcon />
                        {habit.current_streak}
                      </span>
                    ) : (
                      <span className="streak-empty">—</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {habits.length > 0 && (
            <div className="habits-stats">
              <div className="stat-card">
                <span className="stat-value">
                  {Math.max(...habits.map((h) => h.current_streak), 0)}
                </span>
                <span className="stat-label">Best Current Streak</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {Math.max(...habits.map((h) => h.longest_streak), 0)}
                </span>
                <span className="stat-label">Longest Streak Ever</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {habits.reduce((sum, h) => sum + h.total_completions, 0)}
                </span>
                <span className="stat-label">Total Check-ins</span>
              </div>
            </div>
          )}
        </div>

        {(showNewHabitForm || editingHabit) && (
          <HabitModal
            habit={editingHabit}
            onSave={async (data) => {
              if (editingHabit) {
                await updateHabit.mutateAsync({ id: editingHabit.id, ...data })
              } else {
                await createHabit.mutateAsync(data)
              }
              setEditingHabit(null)
              setShowNewHabitForm(false)
            }}
            onDelete={editingHabit ? async () => {
              if (confirm('Delete this habit and all its history?')) {
                await deleteHabit.mutateAsync(editingHabit.id)
                setEditingHabit(null)
              }
            } : undefined}
            onClose={() => { setEditingHabit(null); setShowNewHabitForm(false) }}
          />
        )}

        <style jsx>{`
          .habits-page {
            max-width: 900px;
            margin: 0 auto;
          }
          .habits-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
          }
          .today-summary {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 400;
            margin: 0;
          }
          .new-habit-btn {
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
          .new-habit-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .week-navigation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            cursor: pointer;
            color: var(--color-text-secondary);
          }
          .nav-btn:hover {
            background: var(--color-background-subtle);
            color: var(--color-text);
          }
          .nav-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .today-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8125rem;
            font-weight: 500;
          }
          .habits-grid {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            overflow: hidden;
          }
          .grid-header {
            display: grid;
            grid-template-columns: 200px repeat(7, 1fr) 80px;
            gap: 0;
            border-bottom: 1px solid var(--color-border);
            background: var(--color-background-subtle);
          }
          .habit-name-header,
          .streak-header {
            padding: 0.75rem;
            font-size: 0.6875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: var(--color-text-muted);
          }
          .day-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
          }
          .day-header.today {
            background: var(--color-accent-subtle);
          }
          .day-name {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
          }
          .day-header.today .day-name {
            color: var(--color-accent);
          }
          .day-number {
            font-size: 0.9375rem;
            font-weight: 500;
          }
          .day-header.today .day-number {
            color: var(--color-accent);
          }
          .empty-habits {
            padding: 3rem;
            text-align: center;
            color: var(--color-text-muted);
          }
          .habit-row {
            display: grid;
            grid-template-columns: 200px repeat(7, 1fr) 80px;
            gap: 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .habit-row:last-child {
            border-bottom: none;
          }
          .habit-name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: transparent;
            border: none;
            cursor: pointer;
            text-align: left;
          }
          .habit-name:hover {
            background: var(--color-background-subtle);
          }
          .habit-emoji {
            font-size: 1.125rem;
          }
          .habit-label {
            font-size: 0.875rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .day-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .day-cell:hover:not(.future) {
            background: var(--color-background-subtle);
          }
          .day-cell.today {
            background: var(--color-accent-subtle);
          }
          .day-cell.future {
            cursor: not-allowed;
            opacity: 0.5;
          }
          .day-cell.completed {
            color: var(--habit-color, var(--color-accent));
          }
          .day-cell :global(svg) {
            width: 20px;
            height: 20px;
          }
          .streak-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
          }
          .streak-count {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: #f97316;
          }
          .streak-count :global(svg) {
            width: 14px;
            height: 14px;
          }
          .streak-empty {
            color: var(--color-text-muted);
          }
          .habits-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .stat-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.25rem;
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
          }
          .stat-value {
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
          @media (max-width: 768px) {
            .grid-header,
            .habit-row {
              grid-template-columns: 120px repeat(7, 1fr) 60px;
            }
            .habits-stats {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

interface HabitModalProps {
  habit: Habit | null
  onSave: (data: Partial<Habit>) => void
  onDelete?: () => void
  onClose: () => void
}

function HabitModal({ habit, onSave, onDelete, onClose }: HabitModalProps) {
  const [name, setName] = useState(habit?.name || '')
  const [emoji, setEmoji] = useState(habit?.emoji || '✅')
  const [description, setDescription] = useState(habit?.description || '')
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency || 'daily')
  const [color, setColor] = useState(habit?.color || '#f97316')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      emoji,
      description: description.trim() || null,
      frequency,
      color,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button className="modal-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group emoji-group">
              <label>Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(-2))}
                maxLength={2}
                className="emoji-input"
              />
            </div>
            <div className="form-group name-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Meditate"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this important to you?"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as HabitFrequency)}>
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <div className="color-picker">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-option ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            {onDelete && (
              <button type="button" className="btn-danger" onClick={onDelete}>
                Delete
              </button>
            )}
            <div className="actions-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {habit ? 'Save' : 'Create'}
              </button>
            </div>
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
            max-width: 440px;
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
          }
          .modal-close :global(svg) {
            width: 20px;
            height: 20px;
          }
          .modal-form {
            padding: 1.5rem;
          }
          .form-row {
            display: flex;
            gap: 1rem;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .emoji-group {
            flex: 0 0 60px;
          }
          .name-group {
            flex: 1;
          }
          .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-muted);
            margin-bottom: 0.375rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .form-group input,
          .form-group select {
            width: 100%;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: var(--color-background);
          }
          .emoji-input {
            font-size: 1.25rem !important;
            text-align: center;
          }
          .color-picker {
            display: flex;
            gap: 0.5rem;
          }
          .color-option {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid transparent;
            cursor: pointer;
          }
          .color-option.active {
            border-color: var(--color-text);
          }
          .modal-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1.5rem;
          }
          .actions-right {
            display: flex;
            gap: 0.75rem;
            margin-left: auto;
          }
          .btn-secondary,
          .btn-primary,
          .btn-danger {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-secondary {
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
          }
          .btn-primary {
            color: white;
            background: var(--color-accent);
            border: none;
          }
          .btn-danger {
            color: #ef4444;
            background: #fee2e2;
            border: none;
          }
        `}</style>
      </div>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

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

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 23c-4.97 0-9-4.03-9-9 0-2.95 1.43-5.54 3.62-7.17.37-.28.89-.19 1.17.18.28.37.19.89-.18 1.17C5.52 9.71 4.5 11.76 4.5 14c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-2.24-1.02-4.29-2.61-5.82-.29-.28-.37-.8-.09-1.17.28-.37.8-.46 1.17-.18C20.07 8.46 21.5 11.05 21.5 14c0 4.97-4.03 9-9 9zM12 8V1l-2 2-2-2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V1l-2 2-2-2z"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
