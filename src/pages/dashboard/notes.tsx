import React, { useState } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, useBacklinks, type Note } from '@/hooks/useNotes'

export default function NotesPage() {
  const { data: notes = [], isLoading } = useNotes()
  const { data: pinnedNotes = [] } = useNotes({ is_pinned: true })
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: backlinks = [] } = useBacklinks(selectedNote?.id || '')

  const filteredNotes = searchQuery
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.body_md.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : notes

  const recentNotes = filteredNotes.filter((n) => n.note_type === 'note').slice(0, 10)

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditBody(note.body_md)
    setEditMode(false)
  }

  const handleCreateNote = async () => {
    const newNote = await createNote.mutateAsync({
      title: 'Untitled Note',
      body_md: '',
    })
    handleSelectNote(newNote)
    setEditMode(true)
  }

  const handleSaveNote = async () => {
    if (!selectedNote) return

    await updateNote.mutateAsync({
      id: selectedNote.id,
      title: editTitle,
      body_md: editBody,
    })
    setEditMode(false)
  }

  const handleTogglePin = async (note: Note) => {
    await updateNote.mutateAsync({
      id: note.id,
      is_pinned: !note.is_pinned,
    })
  }

  const handleDelete = async (note: Note) => {
    if (confirm('Delete this note?')) {
      await deleteNote.mutateAsync(note.id)
      if (selectedNote?.id === note.id) {
        setSelectedNote(null)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Notes — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Notes">
        <div className="notes-layout">
          <aside className="notes-sidebar">
            <div className="sidebar-section">
              <button className="new-note-btn" onClick={handleCreateNote}>
                <PlusIcon />
                <span>New Note</span>
              </button>
            </div>

            <div className="sidebar-section">
              <input
                type="text"
                className="search-input"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {pinnedNotes.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-heading">Pinned</h3>
                <div className="notes-list">
                  {pinnedNotes.map((note) => (
                    <button
                      key={note.id}
                      className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                      onClick={() => handleSelectNote(note)}
                    >
                      <PinIcon />
                      <span className="note-item-title">{note.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sidebar-section">
              <h3 className="sidebar-heading">Recent</h3>
              {recentNotes.length === 0 ? (
                <p className="sidebar-empty">No notes yet</p>
              ) : (
                <div className="notes-list">
                  {recentNotes.map((note) => (
                    <button
                      key={note.id}
                      className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                      onClick={() => handleSelectNote(note)}
                    >
                      <FileIcon />
                      <span className="note-item-title">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="notes-main">
            {selectedNote ? (
              <div className="note-editor">
                <div className="editor-header">
                  {editMode ? (
                    <input
                      type="text"
                      className="editor-title-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note title"
                    />
                  ) : (
                    <h2 className="editor-title">{selectedNote.title}</h2>
                  )}

                  <div className="editor-actions">
                    <button
                      className={`action-btn ${selectedNote.is_pinned ? 'active' : ''}`}
                      onClick={() => handleTogglePin(selectedNote)}
                      title={selectedNote.is_pinned ? 'Unpin' : 'Pin'}
                    >
                      <PinIcon />
                    </button>

                    {editMode ? (
                      <button className="action-btn primary" onClick={handleSaveNote}>
                        Save
                      </button>
                    ) : (
                      <button className="action-btn" onClick={() => setEditMode(true)}>
                        Edit
                      </button>
                    )}

                    <button
                      className="action-btn danger"
                      onClick={() => handleDelete(selectedNote)}
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="editor-meta">
                  <span>
                    Updated {new Date(selectedNote.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {selectedNote.tags.length > 0 && (
                    <span className="tags">
                      {selectedNote.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </span>
                  )}
                </div>

                <div className="editor-content">
                  {editMode ? (
                    <textarea
                      className="editor-textarea"
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      placeholder="Write your note in Markdown... Use [[Note Title]] to link to other notes."
                    />
                  ) : (
                    <div className="editor-preview prose">
                      {selectedNote.body_md || (
                        <p className="empty-note">This note is empty. Click Edit to add content.</p>
                      )}
                    </div>
                  )}
                </div>

                {backlinks.length > 0 && !editMode && (
                  <div className="backlinks-section">
                    <h3 className="backlinks-title">
                      <LinkIcon />
                      <span>{backlinks.length} Backlink{backlinks.length !== 1 ? 's' : ''}</span>
                    </h3>
                    <ul className="backlinks-list">
                      {backlinks.map((link) => (
                        <li key={link.id} className="backlink-item">
                          <button
                            onClick={() => {
                              const sourceNote = notes.find((n) => n.id === link.source_note_id)
                              if (sourceNote) handleSelectNote(sourceNote)
                            }}
                            className="backlink-button"
                          >
                            <FileIcon />
                            <span>{link.source_note?.title || 'Unknown note'}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="notes-empty">
                <div className="empty-icon">
                  <FileIcon />
                </div>
                <h3 className="empty-title">Your knowledge base</h3>
                <p className="empty-description">
                  Select a note to view or create a new one
                </p>
                <button className="empty-action" onClick={handleCreateNote}>
                  Create your first note
                </button>
              </div>
            )}
          </main>
        </div>

        <style jsx>{`
          .notes-layout {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 1.5rem;
            min-height: calc(100vh - 200px);
          }
          .notes-sidebar {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1rem;
            height: fit-content;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
          .sidebar-section {
            margin-bottom: 1.5rem;
          }
          .sidebar-section:last-child {
            margin-bottom: 0;
          }
          .new-note-btn {
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
          .new-note-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .search-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            background: var(--color-background);
          }
          .search-input:focus {
            outline: none;
            border-color: var(--color-accent);
          }
          .sidebar-heading {
            font-size: 0.6875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
            margin: 0 0 0.75rem;
          }
          .sidebar-empty {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0;
          }
          .notes-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .note-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.5rem 0.625rem;
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
            background: transparent;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
          }
          .note-item:hover {
            background: var(--color-background-subtle);
            color: var(--color-text);
          }
          .note-item.active {
            background: var(--color-accent-subtle);
            color: var(--color-accent);
          }
          .note-item :global(svg) {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }
          .note-item-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .notes-main {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            min-height: 500px;
          }
          .note-editor {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .editor-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 400;
            margin: 0;
          }
          .editor-title-input {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 400;
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
            margin-right: 1rem;
          }
          .editor-actions {
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
            border-color: var(--color-border);
          }
          .action-btn.active {
            color: var(--color-accent);
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
          .editor-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1.25rem;
            font-size: 0.75rem;
            color: var(--color-text-muted);
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .tags {
            display: flex;
            gap: 0.25rem;
          }
          .tag {
            background: var(--color-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
          }
          .editor-content {
            flex: 1;
            padding: 1.25rem;
            overflow-y: auto;
          }
          .editor-textarea {
            width: 100%;
            height: 100%;
            min-height: 300px;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            line-height: 1.7;
            border: none;
            background: transparent;
            resize: none;
            outline: none;
          }
          .editor-preview {
            font-size: 0.9375rem;
            line-height: 1.7;
            white-space: pre-wrap;
          }
          .empty-note {
            color: var(--color-text-muted);
            font-style: italic;
          }
          .notes-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
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
          .backlinks-section {
            border-top: 1px solid var(--color-border-subtle);
            padding: 1rem 1.25rem;
            background: var(--color-background-subtle);
          }
          .backlinks-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: var(--color-text-muted);
            margin: 0 0 0.75rem;
          }
          .backlinks-title :global(svg) {
            width: 14px;
            height: 14px;
          }
          .backlinks-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .backlink-item {
            margin: 0;
          }
          .backlink-button {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.375rem 0.625rem;
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .backlink-button:hover {
            color: var(--color-accent);
            border-color: var(--color-accent);
            background: var(--color-accent-subtle);
          }
          .backlink-button :global(svg) {
            width: 12px;
            height: 12px;
          }
          @media (max-width: 768px) {
            .notes-layout {
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

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
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

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
