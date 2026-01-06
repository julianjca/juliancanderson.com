import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import {
  useCalendarConnection,
  useAvailableCalendars,
  useUpdateCalendarSettings,
  useDisconnectCalendar,
} from '@/hooks/useCalendar'

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { data: calendarConnection, isLoading: loadingConnection } = useCalendarConnection()
  const { data: availableCalendars = [] } = useAvailableCalendars()
  const updateCalendarSettings = useUpdateCalendarSettings()
  const disconnectCalendar = useDisconnectCalendar()

  const [activeSection, setActiveSection] = useState('account')
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([])
  const [showCalendarSuccess, setShowCalendarSuccess] = useState(false)

  useEffect(() => {
    if (calendarConnection?.calendars_enabled) {
      setSelectedCalendars(calendarConnection.calendars_enabled)
    }
  }, [calendarConnection])

  useEffect(() => {
    if (router.query.calendar_connected === 'true') {
      setShowCalendarSuccess(true)
      setActiveSection('integrations')
      // Clean up URL
      router.replace('/dashboard/settings', undefined, { shallow: true })
    }
  }, [router.query.calendar_connected, router])

  const handleConnectCalendar = () => {
    window.location.href = '/api/calendar/auth'
  }

  const handleDisconnectCalendar = async () => {
    if (confirm('Disconnect Google Calendar?')) {
      await disconnectCalendar.mutateAsync()
    }
  }

  const handleCalendarToggle = (calendarId: string) => {
    setSelectedCalendars((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    )
  }

  const handleSaveCalendars = async () => {
    await updateCalendarSettings.mutateAsync(selectedCalendars)
  }

  const hasCalendarChanges = calendarConnection
    ? JSON.stringify(selectedCalendars.sort()) !== JSON.stringify([...(calendarConnection.calendars_enabled || [])].sort())
    : false

  return (
    <>
      <Head>
        <title>Settings — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Settings">
        <div className="settings-layout">
          <nav className="settings-nav">
            <button
              className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              Account
            </button>
            <button
              className={`nav-item ${activeSection === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveSection('templates')}
            >
              Templates
            </button>
            <button
              className={`nav-item ${activeSection === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveSection('integrations')}
            >
              Integrations
            </button>
            <button
              className={`nav-item ${activeSection === 'data' ? 'active' : ''}`}
              onClick={() => setActiveSection('data')}
            >
              Data
            </button>
          </nav>

          <main className="settings-content">
            {/* Account Section */}
            {activeSection === 'account' && (
              <section className="settings-section">
                <h2 className="section-title">Account</h2>
                <div className="settings-card">
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">Email</h3>
                      <p className="setting-value">{user?.email || 'Not signed in'}</p>
                    </div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">Sign Out</h3>
                      <p className="setting-description">Sign out of your dashboard</p>
                    </div>
                    <button onClick={() => signOut()} className="btn btn--danger">
                      Sign Out
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Templates Section */}
            {activeSection === 'templates' && (
              <section className="settings-section">
                <h2 className="section-title">Templates</h2>
                <div className="settings-card">
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">Daily Note Template</h3>
                      <p className="setting-description">Customize your daily note structure</p>
                    </div>
                    <button className="btn" disabled>Edit</button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">Weekly Review Template</h3>
                      <p className="setting-description">Customize your weekly review prompts</p>
                    </div>
                    <button className="btn" disabled>Edit</button>
                  </div>
                </div>
              </section>
            )}

            {/* Integrations Section */}
            {activeSection === 'integrations' && (
              <section className="settings-section">
                <h2 className="section-title">Integrations</h2>

                {showCalendarSuccess && (
                  <div className="success-banner">
                    <CheckIcon />
                    <span>Google Calendar connected! Select calendars to display below.</span>
                    <button onClick={() => setShowCalendarSuccess(false)} className="dismiss-btn">
                      <XIcon />
                    </button>
                  </div>
                )}

                <div className="settings-card">
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">
                        <CalendarIcon />
                        Google Calendar
                      </h3>
                      <p className="setting-description">
                        {loadingConnection ? 'Checking connection...' :
                          calendarConnection ? 'Connected — view your calendar in the Today page' :
                            'Connect to view your calendar in the Today page'}
                      </p>
                    </div>
                    {!loadingConnection && (
                      calendarConnection ? (
                        <button onClick={handleDisconnectCalendar} className="btn btn--danger">
                          Disconnect
                        </button>
                      ) : (
                        <button onClick={handleConnectCalendar} className="btn btn--primary">
                          Connect
                        </button>
                      )
                    )}
                  </div>

                  {calendarConnection && availableCalendars.length > 0 && (
                    <div className="calendar-selection">
                      <h4 className="selection-label">Select calendars to display:</h4>
                      <div className="calendar-list">
                        {availableCalendars.map((cal) => (
                          <label key={cal.id} className="calendar-option">
                            <input
                              type="checkbox"
                              checked={selectedCalendars.includes(cal.id)}
                              onChange={() => handleCalendarToggle(cal.id)}
                            />
                            <span
                              className="calendar-color"
                              style={{ backgroundColor: cal.backgroundColor || '#4285f4' }}
                            />
                            <span className="calendar-name">
                              {cal.name}
                              {cal.primary && <span className="primary-badge">Primary</span>}
                            </span>
                          </label>
                        ))}
                      </div>
                      {hasCalendarChanges && (
                        <button
                          onClick={handleSaveCalendars}
                          className="btn btn--primary save-calendars"
                          disabled={updateCalendarSettings.isPending}
                        >
                          {updateCalendarSettings.isPending ? 'Saving...' : 'Save Calendar Selection'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Data Section */}
            {activeSection === 'data' && (
              <section className="settings-section">
                <h2 className="section-title">Data</h2>
                <div className="settings-card">
                  <div className="setting-row">
                    <div className="setting-info">
                      <h3 className="setting-label">Export Data</h3>
                      <p className="setting-description">Download all your data as JSON</p>
                    </div>
                    <button className="btn" disabled>Coming Soon</button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>

        <style jsx>{`
          .settings-layout {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 2rem;
          }
          .settings-nav {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .nav-item {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            background: transparent;
            border: none;
            padding: 0.625rem 0.875rem;
            border-radius: 8px;
            text-align: left;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .nav-item:hover {
            color: var(--color-text);
            background: var(--color-background-subtle);
          }
          .nav-item.active {
            color: var(--color-accent);
            background: var(--color-accent-subtle);
          }
          .settings-content {
            max-width: 640px;
          }
          .settings-section {
            margin-bottom: 2.5rem;
          }
          .section-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 400;
            margin: 0 0 1rem;
          }
          .success-banner {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            background: #dcfce7;
            border: 1px solid #86efac;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: #166534;
          }
          .success-banner :global(svg) {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }
          .dismiss-btn {
            margin-left: auto;
            background: transparent;
            border: none;
            color: #166534;
            cursor: pointer;
            padding: 0.25rem;
          }
          .settings-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            overflow: hidden;
          }
          .setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .setting-row:last-child {
            border-bottom: none;
          }
          .setting-info {
            flex: 1;
          }
          .setting-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9375rem;
            font-weight: 500;
            margin: 0 0 0.25rem;
          }
          .setting-label :global(svg) {
            width: 18px;
            height: 18px;
            color: var(--color-text-muted);
          }
          .setting-value {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin: 0;
          }
          .setting-description {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0;
          }
          .calendar-selection {
            padding: 1rem 1.25rem;
            border-top: 1px solid var(--color-border-subtle);
          }
          .selection-label {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-secondary);
            margin: 0 0 0.75rem;
          }
          .calendar-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .calendar-option {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
          }
          .calendar-option:hover {
            background: var(--color-background-subtle);
          }
          .calendar-option input {
            width: 16px;
            height: 16px;
            accent-color: var(--color-accent);
          }
          .calendar-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }
          .calendar-name {
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .primary-badge {
            font-size: 0.6875rem;
            color: var(--color-text-muted);
            background: var(--color-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
          }
          .save-calendars {
            margin-top: 1rem;
          }
          .btn {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .btn:hover:not(:disabled) {
            color: var(--color-text);
            border-color: var(--color-text-muted);
          }
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .btn--primary {
            color: white;
            background: var(--color-accent);
            border-color: var(--color-accent);
          }
          .btn--primary:hover:not(:disabled) {
            background: #ea580c;
            border-color: #ea580c;
          }
          .btn--danger {
            color: #dc2626;
            border-color: #fecaca;
          }
          .btn--danger:hover:not(:disabled) {
            color: white;
            background: #dc2626;
            border-color: #dc2626;
          }
          @media (max-width: 768px) {
            .settings-layout {
              grid-template-columns: 1fr;
            }
            .settings-nav {
              flex-direction: row;
              flex-wrap: wrap;
              margin-bottom: 1rem;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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
