import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useDashboardWidgets,
  useCreateWidget,
  useUpdateWidget,
  useDeleteWidget,
  type DashboardWidget,
} from '@/hooks/usePublicDashboard'

const WIDGET_TYPES = [
  { type: 'working_on', label: 'Working On', description: 'Shows tasks with public visibility and "Doing" status' },
  { type: 'reading_now', label: 'Reading Now', description: 'Shows books you\'re currently reading' },
  { type: 'recent_notes', label: 'Recent Notes', description: 'Shows your most recent public notes' },
  { type: 'projects', label: 'Projects', description: 'Shows public projects with progress' },
  { type: 'stats', label: 'Stats', description: 'Shows aggregate stats and streaks' },
] as const

export default function PublicDashboardPage() {
  const { data: widgets = [], isLoading } = useDashboardWidgets()
  const createWidget = useCreateWidget()
  const updateWidget = useUpdateWidget()
  const deleteWidget = useDeleteWidget()

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')

  const handleAddWidget = async () => {
    if (!selectedType) return
    const widgetType = WIDGET_TYPES.find(w => w.type === selectedType)
    await createWidget.mutateAsync({
      widget_type: selectedType as DashboardWidget['widget_type'],
      title: widgetType?.label || null,
      config: {},
      sort_order: widgets.length,
      is_enabled: true,
    })
    setShowAddModal(false)
    setSelectedType('')
  }

  const handleToggleWidget = async (widget: DashboardWidget) => {
    await updateWidget.mutateAsync({
      id: widget.id,
      is_enabled: !widget.is_enabled,
    })
  }

  const handleDeleteWidget = async (id: string) => {
    if (confirm('Remove this widget from your public dashboard?')) {
      await deleteWidget.mutateAsync(id)
    }
  }

  const enabledWidgets = widgets.filter(w => w.is_enabled)

  return (
    <>
      <Head>
        <title>Public Dashboard — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Public Dashboard">
        <div className="public-header">
          <div className="header-info">
            <p className="header-description">
              Configure what appears on your public dashboard. Only items with "public" visibility will be shown.
            </p>
            <Link href="/public" target="_blank" className="preview-link">
              <ExternalLinkIcon />
              Preview Public Dashboard
            </Link>
          </div>
          <button className="add-widget-btn" onClick={() => setShowAddModal(true)}>
            <PlusIcon />
            Add Widget
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading widgets...</div>
        ) : widgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <GlobeIcon />
            </div>
            <h3 className="empty-title">No widgets configured</h3>
            <p className="empty-description">
              Add widgets to customize what appears on your public dashboard
            </p>
            <button className="empty-action" onClick={() => setShowAddModal(true)}>
              Add Your First Widget
            </button>
          </div>
        ) : (
          <div className="widgets-list">
            {widgets.map((widget) => {
              const widgetType = WIDGET_TYPES.find(w => w.type === widget.widget_type)
              return (
                <div key={widget.id} className={`widget-card ${!widget.is_enabled ? 'disabled' : ''}`}>
                  <div className="widget-header">
                    <div className="widget-info">
                      <h3 className="widget-title">{widget.title || widgetType?.label}</h3>
                      <p className="widget-type">{widgetType?.description}</p>
                    </div>
                    <div className="widget-actions">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={widget.is_enabled}
                          onChange={() => handleToggleWidget(widget)}
                        />
                        <span className="toggle-slider" />
                      </label>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteWidget(widget.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {enabledWidgets.length > 0 && (
          <div className="visibility-reminder">
            <InfoIcon />
            <span>
              Remember: Only items marked as "public" will appear on your public dashboard.
              Update visibility in Tasks, Projects, Notes, or Reading pages.
            </span>
          </div>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Add Widget</h2>
              <div className="widget-options">
                {WIDGET_TYPES.map((type) => (
                  <label key={type.type} className="widget-option">
                    <input
                      type="radio"
                      name="widget-type"
                      value={type.type}
                      checked={selectedType === type.type}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <div className="option-content">
                      <span className="option-label">{type.label}</span>
                      <span className="option-description">{type.description}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleAddWidget}
                  disabled={!selectedType || createWidget.isPending}
                >
                  {createWidget.isPending ? 'Adding...' : 'Add Widget'}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .public-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 2rem;
            gap: 1.5rem;
          }
          .header-info {
            flex: 1;
          }
          .header-description {
            font-size: 0.9375rem;
            color: var(--color-text-secondary);
            margin: 0 0 0.75rem;
          }
          .preview-link {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.8125rem;
            color: var(--color-accent);
          }
          .preview-link :global(svg) {
            width: 14px;
            height: 14px;
          }
          .add-widget-btn {
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
            flex-shrink: 0;
          }
          .add-widget-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .loading {
            text-align: center;
            padding: 3rem;
            color: var(--color-text-muted);
          }
          .empty-state {
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
          .widgets-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .widget-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
          }
          .widget-card.disabled {
            opacity: 0.6;
          }
          .widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .widget-info {
            flex: 1;
          }
          .widget-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.25rem;
          }
          .widget-type {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0;
          }
          .widget-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .toggle {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
          }
          .toggle input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background: var(--color-background-subtle);
            border-radius: 24px;
            transition: 0.2s;
          }
          .toggle-slider::before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: white;
            border-radius: 50%;
            transition: 0.2s;
          }
          .toggle input:checked + .toggle-slider {
            background: var(--color-accent);
          }
          .toggle input:checked + .toggle-slider::before {
            transform: translateX(20px);
          }
          .delete-btn {
            background: transparent;
            border: none;
            padding: 0.5rem;
            color: var(--color-text-muted);
            cursor: pointer;
            border-radius: 6px;
          }
          .delete-btn:hover {
            color: #ef4444;
            background: #fef2f2;
          }
          .delete-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .visibility-reminder {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-top: 2rem;
            padding: 1rem 1.25rem;
            background: var(--color-accent-subtle);
            border-radius: 8px;
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
          }
          .visibility-reminder :global(svg) {
            width: 16px;
            height: 16px;
            color: var(--color-accent);
            flex-shrink: 0;
            margin-top: 1px;
          }
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal {
            background: var(--color-background-card);
            border-radius: 12px;
            padding: 1.5rem;
            width: 100%;
            max-width: 480px;
          }
          .modal-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            margin: 0 0 1.25rem;
          }
          .widget-options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .widget-option {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .widget-option:hover {
            border-color: var(--color-accent);
          }
          .widget-option input {
            margin-top: 3px;
            accent-color: var(--color-accent);
          }
          .option-content {
            flex: 1;
          }
          .option-label {
            display: block;
            font-size: 0.9375rem;
            font-weight: 500;
            margin-bottom: 0.125rem;
          }
          .option-description {
            display: block;
            font-size: 0.8125rem;
            color: var(--color-text-muted);
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
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-primary {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            color: white;
            background: var(--color-accent);
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
          .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </DashboardLayout>
    </>
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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
