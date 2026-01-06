import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useReadingItems,
  useCreateReadingItem,
  useUpdateReadingItem,
  useDeleteReadingItem,
  useReadingSessions,
  useLogReadingSession,
  useReadingStats,
  type ReadingItem,
} from '@/hooks/useReading'

type StatusFilter = 'all' | ReadingItem['status']

const statusTabs: { id: StatusFilter; name: string }[] = [
  { id: 'all', name: 'All' },
  { id: 'reading', name: 'Reading' },
  { id: 'to_read', name: 'To Read' },
  { id: 'finished', name: 'Finished' },
  { id: 'abandoned', name: 'Abandoned' },
]

const itemTypes: { id: ReadingItem['item_type']; name: string }[] = [
  { id: 'book', name: 'Book' },
  { id: 'article', name: 'Article' },
  { id: 'paper', name: 'Paper' },
  { id: 'other', name: 'Other' },
]

export default function ReadingPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { data: items = [], isLoading } = useReadingItems(statusFilter === 'all' ? undefined : statusFilter)
  const { data: weekStats } = useReadingStats(7)
  const { data: allSessions = [] } = useReadingSessions(undefined, 365)
  const createItem = useCreateReadingItem()
  const updateItem = useUpdateReadingItem()
  const deleteItem = useDeleteReadingItem()
  const logSession = useLogReadingSession()

  const [showModal, setShowModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ReadingItem | null>(null)
  const [sessionItem, setSessionItem] = useState<ReadingItem | null>(null)

  // Calculate streak
  const streak = useMemo(() => {
    if (allSessions.length === 0) return 0

    const dates = Array.from(new Set(allSessions.map((s) => s.session_date))).sort().reverse()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Must have read today or yesterday to have a streak
    if (dates[0] !== today && dates[0] !== yesterday) return 0

    let count = 1
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const diff = (prevDate.getTime() - currDate.getTime()) / 86400000
      if (diff === 1) {
        count++
      } else {
        break
      }
    }
    return count
  }, [allSessions])

  // Count books finished this year
  const booksThisYear = useMemo(() => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString()
    return items.filter((i) => i.status === 'finished' && i.finished_at && i.finished_at >= yearStart).length
  }, [items])

  // Count currently reading
  const currentlyReading = useMemo(() => {
    return items.filter((i) => i.status === 'reading').length
  }, [items])

  const handleCreate = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEdit = (item: ReadingItem) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      await deleteItem.mutateAsync(id)
    }
  }

  const handleLogSession = (item: ReadingItem) => {
    setSessionItem(item)
    setShowSessionModal(true)
  }

  const handleStatusChange = async (id: string, status: ReadingItem['status']) => {
    await updateItem.mutateAsync({ id, status })
  }

  return (
    <>
      <Head>
        <title>Reading — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Reading">
        <div className="reading-header">
          <div className="reading-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <button className="add-reading-btn" onClick={handleCreate}>
            <PlusIcon />
            <span>Add Book</span>
          </button>
        </div>

        <div className="reading-stats">
          <div className="stat-card">
            <span className="stat-value">{currentlyReading}</span>
            <span className="stat-label">Currently Reading</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{booksThisYear}</span>
            <span className="stat-label">Books This Year</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{weekStats?.totalMinutes || 0}m</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading reading list...</div>
        ) : items.length === 0 ? (
          <div className="reading-empty">
            <div className="empty-icon">
              <BookIcon />
            </div>
            <h3 className="empty-title">
              {statusFilter === 'all' ? 'Track your reading' : `No ${statusFilter.replace('_', ' ')} items`}
            </h3>
            <p className="empty-description">
              {statusFilter === 'all'
                ? 'Add books you\'re reading, log sessions, and build your reading habit'
                : 'Items will appear here when you have some'}
            </p>
            {statusFilter === 'all' && (
              <button className="empty-action" onClick={handleCreate}>
                Add your first book
              </button>
            )}
          </div>
        ) : (
          <div className="reading-grid">
            {items.map((item) => (
              <ReadingCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLogSession={handleLogSession}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {showModal && (
          <ReadingModal
            item={editingItem}
            onSave={async (data) => {
              if (editingItem) {
                await updateItem.mutateAsync({ id: editingItem.id, ...data })
              } else {
                await createItem.mutateAsync(data)
              }
              setShowModal(false)
              setEditingItem(null)
            }}
            onClose={() => {
              setShowModal(false)
              setEditingItem(null)
            }}
          />
        )}

        {showSessionModal && sessionItem && (
          <SessionModal
            item={sessionItem}
            onSave={async (minutes, pages) => {
              await logSession.mutateAsync({
                reading_item_id: sessionItem.id,
                minutes_read: minutes,
                pages_read: pages,
              })
              setShowSessionModal(false)
              setSessionItem(null)
            }}
            onClose={() => {
              setShowSessionModal(false)
              setSessionItem(null)
            }}
          />
        )}

        <style jsx>{`
          .reading-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .reading-tabs {
            display: flex;
            gap: 0.25rem;
            background: var(--color-background-subtle);
            padding: 0.25rem;
            border-radius: 8px;
            overflow-x: auto;
          }
          .tab-btn {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-muted);
            background: transparent;
            border: none;
            border-radius: 6px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            white-space: nowrap;
          }
          .tab-btn:hover {
            color: var(--color-text);
          }
          .tab-btn.active {
            color: var(--color-text);
            background: var(--color-background-card);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          .add-reading-btn {
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
          .add-reading-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .reading-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .stat-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
            text-align: center;
          }
          .stat-value {
            display: block;
            font-family: var(--font-display);
            font-size: 1.75rem;
            color: var(--color-text);
            margin-bottom: 0.25rem;
          }
          .stat-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .loading {
            text-align: center;
            padding: 3rem;
            color: var(--color-text-muted);
          }
          .reading-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            background: var(--color-background-card);
            border: 1px dashed var(--color-border);
            border-radius: 12px;
            text-align: center;
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
            max-width: 320px;
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
          .reading-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
          }
          @media (max-width: 768px) {
            .reading-stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

// Reading Card Component
function ReadingCard({
  item,
  onEdit,
  onDelete,
  onLogSession,
  onStatusChange,
}: {
  item: ReadingItem
  onEdit: (item: ReadingItem) => void
  onDelete: (id: string) => void
  onLogSession: (item: ReadingItem) => void
  onStatusChange: (id: string, status: ReadingItem['status']) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const progress = item.total_pages ? Math.round((item.current_page / item.total_pages) * 100) : 0

  const statusColors: Record<ReadingItem['status'], string> = {
    reading: '#3b82f6',
    to_read: '#6b7280',
    finished: '#22c55e',
    abandoned: '#ef4444',
  }

  return (
    <div className="reading-card">
      <div className="card-header">
        <span className="status-badge" style={{ background: statusColors[item.status] }}>
          {item.status.replace('_', ' ')}
        </span>
        <div className="card-menu-wrapper">
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreIcon />
          </button>
          {showMenu && (
            <div className="card-menu">
              <button onClick={() => { onEdit(item); setShowMenu(false) }}>Edit</button>
              {item.status === 'reading' && (
                <button onClick={() => { onLogSession(item); setShowMenu(false) }}>Log Session</button>
              )}
              <div className="menu-divider" />
              {item.status !== 'reading' && (
                <button onClick={() => { onStatusChange(item.id, 'reading'); setShowMenu(false) }}>
                  Start Reading
                </button>
              )}
              {item.status !== 'finished' && (
                <button onClick={() => { onStatusChange(item.id, 'finished'); setShowMenu(false) }}>
                  Mark Finished
                </button>
              )}
              <div className="menu-divider" />
              <button onClick={() => { onDelete(item.id); setShowMenu(false) }} className="danger">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-content">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} className="cover-image" />
        ) : (
          <div className="cover-placeholder">
            <BookIcon />
          </div>
        )}
        <div className="card-info">
          <h4 className="card-title">{item.title}</h4>
          {item.author && <p className="card-author">{item.author}</p>}
          <span className="card-type">{item.item_type}</span>
        </div>
      </div>

      {item.total_pages && item.status === 'reading' && (
        <div className="progress-section">
          <div className="progress-text">
            <span>{item.current_page} / {item.total_pages} pages</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {item.rating && item.status === 'finished' && (
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < item.rating!} />
          ))}
        </div>
      )}

      {item.tags.length > 0 && (
        <div className="card-tags">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {item.tags.length > 3 && <span className="tag">+{item.tags.length - 3}</span>}
        </div>
      )}

      <style jsx>{`
        .reading-card {
          background: var(--color-background-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1rem;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .status-badge {
          font-size: 0.6875rem;
          font-weight: 500;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: capitalize;
        }
        .card-menu-wrapper {
          position: relative;
        }
        .menu-btn {
          background: transparent;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          color: var(--color-text-muted);
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .reading-card:hover .menu-btn {
          opacity: 1;
        }
        .menu-btn:hover {
          background: var(--color-background-subtle);
          color: var(--color-text);
        }
        .card-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--color-background-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          box-shadow: var(--shadow-card-hover);
          overflow: hidden;
          z-index: 10;
          min-width: 140px;
        }
        .card-menu button {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          font-size: 0.8125rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .card-menu button:hover {
          background: var(--color-background-subtle);
        }
        .card-menu button.danger {
          color: #ef4444;
        }
        .menu-divider {
          height: 1px;
          background: var(--color-border);
          margin: 0.25rem 0;
        }
        .card-content {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .cover-image {
          width: 60px;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
        }
        .cover-placeholder {
          width: 60px;
          height: 90px;
          background: var(--color-background-subtle);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          flex-shrink: 0;
        }
        .cover-placeholder :global(svg) {
          width: 24px;
          height: 24px;
        }
        .card-info {
          flex: 1;
          min-width: 0;
        }
        .card-title {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          line-height: 1.3;
        }
        .card-author {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          margin: 0 0 0.375rem;
        }
        .card-type {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          background: var(--color-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          text-transform: capitalize;
        }
        .progress-section {
          margin-bottom: 0.75rem;
        }
        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }
        .progress-bar {
          height: 4px;
          background: var(--color-background-subtle);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--color-accent);
          transition: width 0.3s ease;
        }
        .rating {
          display: flex;
          gap: 0.125rem;
          margin-bottom: 0.5rem;
        }
        .rating :global(svg) {
          width: 14px;
          height: 14px;
        }
        .card-tags {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .tag {
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

// Reading Modal Component
function ReadingModal({
  item,
  onSave,
  onClose,
}: {
  item: ReadingItem | null
  onSave: (data: Partial<ReadingItem>) => Promise<void>
  onClose: () => void
}) {
  const [title, setTitle] = useState(item?.title || '')
  const [author, setAuthor] = useState(item?.author || '')
  const [itemType, setItemType] = useState<ReadingItem['item_type']>(item?.item_type || 'book')
  const [status, setStatus] = useState<ReadingItem['status']>(item?.status || 'to_read')
  const [totalPages, setTotalPages] = useState(item?.total_pages?.toString() || '')
  const [currentPage, setCurrentPage] = useState(item?.current_page?.toString() || '0')
  const [coverUrl, setCoverUrl] = useState(item?.cover_url || '')
  const [url, setUrl] = useState(item?.url || '')
  const [tags, setTags] = useState(item?.tags?.join(', ') || '')
  const [rating, setRating] = useState(item?.rating || 0)
  const [notes, setNotes] = useState(item?.notes || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSaving(true)
    await onSave({
      title: title.trim(),
      author: author.trim() || null,
      item_type: itemType,
      status,
      total_pages: totalPages ? parseInt(totalPages) : null,
      current_page: parseInt(currentPage) || 0,
      cover_url: coverUrl.trim() || null,
      url: url.trim() || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      rating: rating || null,
      notes: notes.trim() || null,
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button className="close-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" value={itemType} onChange={(e) => setItemType(e.target.value as ReadingItem['item_type'])}>
                {itemTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ReadingItem['status'])}>
                <option value="to_read">To Read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalPages">Total Pages</label>
              <input
                id="totalPages"
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="350"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentPage">Current Page</label>
              <input
                id="currentPage"
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverUrl">Cover URL</label>
            <input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">Link (optional)</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="fiction, sci-fi, favorites"
            />
          </div>

          {(status === 'finished' || item?.status === 'finished') && (
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="star-btn"
                  >
                    <StarIcon filled={star <= rating} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your thoughts..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : item ? 'Save' : 'Add'}
            </button>
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
          }
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .modal-header h2 {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0;
          }
          .close-btn {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
            border-radius: 4px;
          }
          .close-btn:hover {
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
          .rating-input {
            display: flex;
            gap: 0.25rem;
          }
          .star-btn {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
          }
          .star-btn:hover {
            color: var(--color-accent);
          }
          .star-btn :global(svg) {
            width: 24px;
            height: 24px;
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
          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  )
}

// Session Modal Component
function SessionModal({
  item,
  onSave,
  onClose,
}: {
  item: ReadingItem
  onSave: (minutes: number, pages: number) => Promise<void>
  onClose: () => void
}) {
  const [minutes, setMinutes] = useState('')
  const [pages, setPages] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!minutes) return

    setSaving(true)
    await onSave(parseInt(minutes), parseInt(pages) || 0)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Reading Session</h2>
          <button className="close-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="session-book">
          <BookIcon />
          <span>{item.title}</span>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minutes">Minutes Read *</label>
              <input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="30"
                min="1"
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pages">Pages Read</label>
              <input
                id="pages"
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="20"
                min="0"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Logging...' : 'Log Session'}
            </button>
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
            max-width: 400px;
          }
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .modal-header h2 {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0;
          }
          .close-btn {
            background: transparent;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
            border-radius: 4px;
          }
          .session-book {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            background: var(--color-background-subtle);
            font-size: 0.875rem;
            font-weight: 500;
          }
          .session-book :global(svg) {
            width: 16px;
            height: 16px;
            color: var(--color-text-muted);
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
          .form-group input {
            width: 100%;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: var(--color-background);
            color: var(--color-text);
          }
          .form-group input:focus {
            outline: none;
            border-color: var(--color-accent);
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
            margin-top: 1rem;
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
          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  )
}

// Icons
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
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

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? '#f97316' : 'none'}
      stroke={filled ? '#f97316' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
