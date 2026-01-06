import React, { ReactNode, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { CommandPalette } from './CommandPalette'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: GridIcon },
  { name: 'Today', href: '/dashboard/today', icon: SunIcon },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquareIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
  { name: 'Notes', href: '/dashboard/notes', icon: FileTextIcon },
  { name: 'Reading', href: '/dashboard/reading', icon: BookIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartIcon },
]

const secondaryNav = [
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
]

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === '/dashboard'
    }
    return router.pathname.startsWith(href)
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <span className="sidebar-logo-mark">J</span>
            {!sidebarCollapsed && <span className="sidebar-logo-text">Julian</span>}
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronIcon direction={sidebarCollapsed ? 'right' : 'left'} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-nav-item ${active ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="sidebar-nav-divider" />

          <ul className="sidebar-nav-list">
            {secondaryNav.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-nav-item ${active ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-user"
            onClick={() => signOut()}
            title="Sign out"
          >
            <div className="sidebar-user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="sidebar-user-action">Sign out</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {title && (
          <header className="dashboard-header">
            <h1 className="dashboard-title">{title}</h1>
            <button
              className="search-button"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <SearchIcon />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
          </header>
        )}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-background);
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 240px;
          background: var(--color-background-card);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
          transition: width 0.2s ease;
        }

        .dashboard-sidebar.collapsed {
          width: 72px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--color-text);
          text-decoration: none;
        }

        .sidebar-logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
          border-radius: 10px;
          color: white;
          font-family: var(--font-display);
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        .sidebar-logo-text {
          font-family: var(--font-display);
          font-size: 1.125rem;
          letter-spacing: -0.02em;
        }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .sidebar-toggle:hover {
          background: var(--color-background-subtle);
          color: var(--color-text);
        }

        .collapsed .sidebar-toggle {
          display: none;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .sidebar-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-nav-divider {
          height: 1px;
          background: var(--color-border-subtle);
          margin: 1rem 0;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .sidebar-nav-item:hover {
          background: var(--color-background-subtle);
          color: var(--color-text);
        }

        .sidebar-nav-item.active {
          background: var(--color-accent-subtle);
          color: var(--color-accent);
        }

        .sidebar-nav-item :global(svg) {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .collapsed .sidebar-nav-item {
          justify-content: center;
          padding: 0.75rem;
        }

        /* Footer */
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .sidebar-user:hover {
          background: var(--color-background-subtle);
        }

        .sidebar-user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--color-background-subtle);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.8125rem;
          font-weight: 500;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .sidebar-user-name {
          font-size: 0.875rem;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-action {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .collapsed .sidebar-user {
          justify-content: center;
          padding: 0.75rem;
        }

        /* Main content */
        .dashboard-main {
          flex: 1;
          margin-left: 240px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.2s ease;
        }

        .collapsed ~ .dashboard-main {
          margin-left: 72px;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2.5rem 0;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: var(--color-background-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .search-button:hover {
          border-color: var(--color-text-muted);
          color: var(--color-text);
        }

        .search-button :global(svg) {
          width: 14px;
          height: 14px;
        }

        .search-button kbd {
          font-size: 0.6875rem;
          background: var(--color-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          margin-left: 0.5rem;
        }

        .dashboard-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 400;
          color: var(--color-text);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .dashboard-content {
          flex: 1;
          padding: 1.5rem 2.5rem 2.5rem;
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 72px;
          }

          .sidebar-logo-text,
          .sidebar-nav-item span,
          .sidebar-user-info,
          .sidebar-toggle {
            display: none;
          }

          .sidebar-nav-item {
            justify-content: center;
            padding: 0.75rem;
          }

          .sidebar-user {
            justify-content: center;
            padding: 0.75rem;
          }

          .dashboard-main {
            margin-left: 72px;
          }

          .dashboard-header {
            padding: 1.5rem 1.5rem 0;
          }

          .dashboard-content {
            padding: 1rem 1.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

// Icon components
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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

function CheckSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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

function FileTextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
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

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, transform: direction === 'right' ? 'rotate(180deg)' : undefined }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
