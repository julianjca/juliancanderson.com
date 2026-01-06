import React, { useState } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useWorkouts,
  useCreateWorkout,
  useDeleteWorkout,
  useWeightLogs,
  useLogWeight,
  useWorkoutStats,
  type Workout,
  type WorkoutType,
} from '@/hooks/useHealth'

const WORKOUT_TYPES: { value: WorkoutType; label: string; emoji: string }[] = [
  { value: 'strength', label: 'Strength', emoji: '🏋️' },
  { value: 'cardio', label: 'Cardio', emoji: '🏃' },
  { value: 'yoga', label: 'Yoga', emoji: '🧘' },
  { value: 'walking', label: 'Walking', emoji: '🚶' },
  { value: 'cycling', label: 'Cycling', emoji: '🚴' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'other', label: 'Other', emoji: '💪' },
]

export default function HealthPage() {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [showWeightForm, setShowWeightForm] = useState(false)

  const { data: workouts = [] } = useWorkouts(20)
  const { data: weightLogs = [] } = useWeightLogs(10)
  const { data: stats } = useWorkoutStats()

  const createWorkout = useCreateWorkout()
  const deleteWorkout = useDeleteWorkout()
  const logWeight = useLogWeight()

  const [newWorkout, setNewWorkout] = useState({
    title: '',
    workout_type: '' as WorkoutType | '',
    workout_date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    calories_burned: '',
    notes: '',
  })

  const [newWeight, setNewWeight] = useState({
    log_date: new Date().toISOString().split('T')[0],
    weight_kg: '',
  })

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkout.title.trim()) return

    await createWorkout.mutateAsync({
      title: newWorkout.title.trim(),
      workout_type: newWorkout.workout_type || null,
      workout_date: newWorkout.workout_date,
      duration_minutes: newWorkout.duration_minutes ? parseInt(newWorkout.duration_minutes) : null,
      calories_burned: newWorkout.calories_burned ? parseInt(newWorkout.calories_burned) : null,
      notes: newWorkout.notes || null,
    })

    setNewWorkout({
      title: '',
      workout_type: '',
      workout_date: new Date().toISOString().split('T')[0],
      duration_minutes: '',
      calories_burned: '',
      notes: '',
    })
    setShowWorkoutForm(false)
  }

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWeight.weight_kg) return

    await logWeight.mutateAsync({
      log_date: newWeight.log_date,
      weight_kg: parseFloat(newWeight.weight_kg),
    })

    setNewWeight({
      log_date: new Date().toISOString().split('T')[0],
      weight_kg: '',
    })
    setShowWeightForm(false)
  }

  const latestWeight = weightLogs[0]

  return (
    <>
      <Head>
        <title>Health — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Health & Fitness">
        <div className="health-page">
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-emoji">🏋️</span>
              <span className="stat-value">{stats?.totalWorkouts || 0}</span>
              <span className="stat-label">Workouts (30d)</span>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">⏱️</span>
              <span className="stat-value">{stats?.totalMinutes || 0}</span>
              <span className="stat-label">Minutes</span>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">🔥</span>
              <span className="stat-value">{stats?.totalCalories || 0}</span>
              <span className="stat-label">Calories</span>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">⚖️</span>
              <span className="stat-value">{latestWeight?.weight_kg || '—'}</span>
              <span className="stat-label">Weight (kg)</span>
            </div>
          </div>

          <div className="health-grid">
            <section className="health-section">
              <div className="section-header">
                <h2 className="section-title">Recent Workouts</h2>
                <button className="add-btn" onClick={() => setShowWorkoutForm(true)}>
                  <PlusIcon />
                  <span>Log Workout</span>
                </button>
              </div>

              {workouts.length === 0 ? (
                <div className="empty-state">
                  <p>No workouts logged yet. Start tracking your fitness!</p>
                </div>
              ) : (
                <ul className="workout-list">
                  {workouts.map((workout) => (
                    <li key={workout.id} className="workout-item">
                      <div className="workout-info">
                        <span className="workout-emoji">
                          {WORKOUT_TYPES.find((t) => t.value === workout.workout_type)?.emoji || '💪'}
                        </span>
                        <div className="workout-details">
                          <span className="workout-title">{workout.title}</span>
                          <span className="workout-meta">
                            {new Date(workout.workout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {workout.duration_minutes && ` • ${workout.duration_minutes} min`}
                            {workout.calories_burned && ` • ${workout.calories_burned} cal`}
                          </span>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteWorkout.mutate(workout.id)}
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="health-section">
              <div className="section-header">
                <h2 className="section-title">Weight Log</h2>
                <button className="add-btn" onClick={() => setShowWeightForm(true)}>
                  <PlusIcon />
                  <span>Log Weight</span>
                </button>
              </div>

              {weightLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No weight entries yet. Start tracking!</p>
                </div>
              ) : (
                <ul className="weight-list">
                  {weightLogs.map((log) => (
                    <li key={log.id} className="weight-item">
                      <span className="weight-date">
                        {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="weight-value">{log.weight_kg} kg</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        {showWorkoutForm && (
          <div className="modal-overlay" onClick={() => setShowWorkoutForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Log Workout</h3>
              <form onSubmit={handleCreateWorkout}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                    placeholder="e.g., Morning Run"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={newWorkout.workout_type}
                      onChange={(e) => setNewWorkout({ ...newWorkout, workout_type: e.target.value as WorkoutType })}
                    >
                      <option value="">Select type</option>
                      {WORKOUT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newWorkout.workout_date}
                      onChange={(e) => setNewWorkout({ ...newWorkout, workout_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      value={newWorkout.duration_minutes}
                      onChange={(e) => setNewWorkout({ ...newWorkout, duration_minutes: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input
                      type="number"
                      value={newWorkout.calories_burned}
                      onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: e.target.value })}
                      placeholder="200"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowWorkoutForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showWeightForm && (
          <div className="modal-overlay" onClick={() => setShowWeightForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Log Weight</h3>
              <form onSubmit={handleLogWeight}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newWeight.log_date}
                      onChange={(e) => setNewWeight({ ...newWeight, log_date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight.weight_kg}
                      onChange={(e) => setNewWeight({ ...newWeight, weight_kg: e.target.value })}
                      placeholder="70.5"
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowWeightForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .health-page {
            max-width: 900px;
            margin: 0 auto;
          }
          .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
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
          .stat-emoji {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .stat-value {
            font-family: var(--font-display);
            font-size: 1.75rem;
          }
          .stat-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .health-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          .health-section {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
          }
          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }
          .section-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0;
          }
          .add-btn {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-accent);
            background: var(--color-accent-subtle);
            border: none;
            border-radius: 6px;
            padding: 0.375rem 0.625rem;
            cursor: pointer;
          }
          .add-btn :global(svg) {
            width: 14px;
            height: 14px;
          }
          .empty-state {
            padding: 2rem;
            text-align: center;
            color: var(--color-text-muted);
            font-size: 0.875rem;
          }
          .workout-list, .weight-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .workout-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .workout-item:last-child {
            border-bottom: none;
          }
          .workout-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .workout-emoji {
            font-size: 1.25rem;
          }
          .workout-details {
            display: flex;
            flex-direction: column;
          }
          .workout-title {
            font-size: 0.9375rem;
            font-weight: 500;
          }
          .workout-meta {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .delete-btn {
            background: none;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 0.25rem;
            opacity: 0;
            transition: opacity 0.15s;
          }
          .workout-item:hover .delete-btn {
            opacity: 1;
          }
          .delete-btn:hover {
            color: #ef4444;
          }
          .delete-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .weight-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .weight-item:last-child {
            border-bottom: none;
          }
          .weight-date {
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
          }
          .weight-value {
            font-size: 0.9375rem;
            font-weight: 500;
          }
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
            padding: 1.5rem;
            width: 100%;
            max-width: 400px;
          }
          .modal-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0 0 1.25rem;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-muted);
            margin-bottom: 0.375rem;
          }
          .form-group input,
          .form-group select {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            background: var(--color-background);
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .btn-secondary, .btn-primary {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 6px;
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
          @media (max-width: 768px) {
            .stats-row {
              grid-template-columns: repeat(2, 1fr);
            }
            .health-grid {
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
