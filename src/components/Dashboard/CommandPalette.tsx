import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { useNotes } from '@/hooks/useNotes'
import { useReadingItems } from '@/hooks/useReading'

interface CommandItem {
  id: string
  type: 'task' | 'project' | 'note' | 'reading' | 'command'
  title: string
  subtitle?: string
  action: () => void
  icon: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { data: tasks = [] } = useTasks()
  const { data: projects = [] } = useProjects('active')
  const { data: notes = [] } = useNotes()
  const { data: readingItems = [] } = useReadingItems()

  // Navigation commands
  const navigationCommands: CommandItem[] = useMemo(() => [
    { id: 'nav-today', type: 'command', title: 'Go to Today', icon: '📅', action: () => router.push('/dashboard/today') },
    { id: 'nav-tasks', type: 'command', title: 'Go to Tasks', icon: '✓', action: () => router.push('/dashboard/tasks') },
    { id: 'nav-projects', type: 'command', title: 'Go to Projects', icon: '📁', action: () => router.push('/dashboard/projects') },
    { id: 'nav-notes', type: 'command', title: 'Go to Notes', icon: '📝', action: () => router.push('/dashboard/notes') },
    { id: 'nav-reading', type: 'command', title: 'Go to Reading', icon: '📖', action: () => router.push('/dashboard/reading') },
    { id: 'nav-analytics', type: 'command', title: 'Go to Analytics', icon: '📊', action: () => router.push('/dashboard/analytics') },
    { id: 'nav-settings', type: 'command', title: 'Go to Settings', icon: '⚙️', action: () => router.push('/dashboard/settings') },
    { id: 'nav-public', type: 'command', title: 'Edit Public Dashboard', icon: '🌐', action: () => router.push('/dashboard/public') },
  ], [router])

  // Action commands
  const actionCommands: CommandItem[] = useMemo(() => [
    { id: 'new-task', type: 'command', title: 'New Task', subtitle: 'Create a new task', icon: '➕', action: () => router.push('/dashboard/tasks?new=true') },
    { id: 'new-note', type: 'command', title: 'New Note', subtitle: 'Create a new note', icon: '📄', action: () => router.push('/dashboard/notes?new=true') },
    { id: 'new-project', type: 'command', title: 'New Project', subtitle: 'Create a new project', icon: '📁', action: () => router.push('/dashboard/projects?new=true') },
  ], [router])

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [...actionCommands, ...navigationCommands]
    }

    const lowerQuery = query.toLowerCase()
    const results: CommandItem[] = []

    // Search tasks
    tasks.filter(t => t.title.toLowerCase().includes(lowerQuery) || t.description?.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .forEach(t => {
        results.push({
          id: `task-${t.id}`,
          type: 'task',
          title: t.title,
          subtitle: `Task · ${t.status}`,
          icon: t.status === 'Done' ? '✅' : '☐',
          action: () => router.push(`/dashboard/tasks?id=${t.id}`),
        })
      })

    // Search projects
    projects.filter(p => p.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(p => {
        results.push({
          id: `project-${p.id}`,
          type: 'project',
          title: p.name,
          subtitle: 'Project',
          icon: '📁',
          action: () => router.push(`/dashboard/tasks?project=${p.id}`),
        })
      })

    // Search notes
    notes.filter(n => n.title.toLowerCase().includes(lowerQuery) || n.body_md.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .forEach(n => {
        results.push({
          id: `note-${n.id}`,
          type: 'note',
          title: n.title,
          subtitle: `Note · ${n.note_type}`,
          icon: '📝',
          action: () => router.push(`/dashboard/notes?id=${n.id}`),
        })
      })

    // Search reading items
    readingItems.filter(r => r.title.toLowerCase().includes(lowerQuery) || r.author?.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(r => {
        results.push({
          id: `reading-${r.id}`,
          type: 'reading',
          title: r.title,
          subtitle: r.author ? `${r.author} · ${r.status}` : r.status,
          icon: '📖',
          action: () => router.push(`/dashboard/reading?id=${r.id}`),
        })
      })

    // Filter commands that match
    const matchingCommands = [...actionCommands, ...navigationCommands].filter(
      c => c.title.toLowerCase().includes(lowerQuery) || c.subtitle?.toLowerCase().includes(lowerQuery)
    )

    return [...results, ...matchingCommands]
  }, [query, tasks, projects, notes, readingItems, actionCommands, navigationCommands, router])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults.length])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (searchResults[selectedIndex]) {
          searchResults[selectedIndex].action()
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }, [searchResults, selectedIndex, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Close on click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="palette-overlay" onClick={handleOverlayClick}>
      <div className="palette">
        <div className="palette-input-wrapper">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or jump to..."
            className="palette-input"
          />
          <kbd className="palette-shortcut">esc</kbd>
        </div>

        <div className="palette-results" ref={listRef}>
          {searchResults.length === 0 ? (
            <div className="palette-empty">No results found</div>
          ) : (
            searchResults.map((item, index) => (
              <button
                key={item.id}
                className={`palette-item ${index === selectedIndex ? 'selected' : ''}`}
                data-selected={index === selectedIndex}
                onClick={() => {
                  item.action()
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="item-icon">{item.icon}</span>
                <div className="item-content">
                  <span className="item-title">{item.title}</span>
                  {item.subtitle && <span className="item-subtitle">{item.subtitle}</span>}
                </div>
                <span className={`item-type ${item.type}`}>{item.type}</span>
              </button>
            ))
          )}
        </div>

        <div className="palette-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>

      <style jsx>{`
        .palette-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          z-index: 2000;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .palette {
          background: var(--color-background-card);
          border-radius: 12px;
          width: 100%;
          max-width: 560px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.15s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .palette-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .palette-input-wrapper :global(svg) {
          width: 18px;
          height: 18px;
          color: var(--color-text-muted);
          flex-shrink: 0;
        }
        .palette-input {
          flex: 1;
          font-size: 1rem;
          border: none;
          background: transparent;
          color: var(--color-text);
          outline: none;
        }
        .palette-input::placeholder {
          color: var(--color-text-muted);
        }
        .palette-shortcut {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          background: var(--color-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: var(--font-body);
        }
        .palette-results {
          max-height: 360px;
          overflow-y: auto;
        }
        .palette-empty {
          padding: 2rem;
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
        }
        .palette-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1.25rem;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.1s ease;
        }
        .palette-item:hover,
        .palette-item.selected {
          background: var(--color-background-subtle);
        }
        .item-icon {
          font-size: 1.125rem;
          flex-shrink: 0;
        }
        .item-content {
          flex: 1;
          overflow: hidden;
        }
        .item-title {
          display: block;
          font-size: 0.9375rem;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-subtitle {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-type {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          background: var(--color-background);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          text-transform: capitalize;
          flex-shrink: 0;
        }
        .item-type.command {
          background: var(--color-accent-subtle);
          color: var(--color-accent);
        }
        .palette-footer {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem 1.25rem;
          border-top: 1px solid var(--color-border-subtle);
          font-size: 0.6875rem;
          color: var(--color-text-muted);
        }
        .palette-footer kbd {
          background: var(--color-background-subtle);
          padding: 0.125rem 0.25rem;
          border-radius: 3px;
          margin-right: 0.25rem;
        }
      `}</style>
    </div>
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
