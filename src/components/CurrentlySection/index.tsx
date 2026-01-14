'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { CurrentlyItem } from '@/components/Currently'

// Fallback data
import currentlyData from '@/content/currently.json'

const typeConfig: Record<CurrentlyItem['type'], { emoji: string; label: string }> = {
  reading: { emoji: '📚', label: 'Reading' },
  watching: { emoji: '📺', label: 'Watching' },
  playing: { emoji: '🎮', label: 'Playing' },
  researching: { emoji: '🔍', label: 'Researching' },
  listening: { emoji: '🎧', label: 'Listening' },
  building: { emoji: '🛠', label: 'Building' },
}

async function fetchCurrentlyItems(): Promise<CurrentlyItem[]> {
  const res = await fetch('/api/currently')
  if (!res.ok) {
    throw new Error('Failed to fetch')
  }
  return res.json()
}

interface CurrentlySectionProps {
  initialItems?: CurrentlyItem[]
}

export function CurrentlySection({ initialItems }: CurrentlySectionProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null)

  const fallbackData = initialItems && initialItems.length > 0
    ? initialItems
    : (currentlyData.items as CurrentlyItem[])

  const { data: currentlyItems = [], isLoading } = useQuery({
    queryKey: ['currently'],
    queryFn: fetchCurrentlyItems,
    initialData: fallbackData,
  })

  // Group items by type
  const grouped = currentlyItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, CurrentlyItem[]>
  )

  const handleStackClick = (type: string, itemCount: number) => {
    if (itemCount > 1) {
      setExpandedType(expandedType === type ? null : type)
    }
  }

  return (
    <section
      className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
      style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3 mb-10">
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
        <h2 className="font-display text-3xl">Currently</h2>
        {isLoading && (
          <span className="text-xs text-black/30 animate-pulse">updating...</span>
        )}
      </div>

      {/* Category Stacks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Object.entries(grouped).map(([type, items]) => {
          const config = typeConfig[type as CurrentlyItem['type']]
          const isExpanded = expandedType === type
          const hasMultiple = items.length > 1

          return (
            <div
              key={type}
              className="group/stack"
              onMouseEnter={() => hasMultiple && setExpandedType(type)}
              onMouseLeave={() => setExpandedType(null)}
            >
              {/* Category Label */}
              <button
                onClick={() => handleStackClick(type, items.length)}
                className={`
                  flex items-center gap-2 mb-3 w-full text-left
                  ${hasMultiple ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}
                  transition-opacity
                `}
              >
                <span className="text-lg">{config.emoji}</span>
                <span className="text-[11px] text-black/40 uppercase tracking-widest font-semibold">
                  {config.label}
                </span>
                {hasMultiple && (
                  <span
                    className={`
                      text-[10px] font-medium transition-colors
                      ${isExpanded ? 'text-orange-600' : 'text-orange-500'}
                    `}
                  >
                    {isExpanded ? '−' : `+${items.length - 1}`}
                  </span>
                )}
              </button>

              {/* Stacked Cards */}
              <div
                className="relative transition-all duration-300 ease-out"
                style={{
                  height: isExpanded
                    ? `${items.length * 90 + (items.length - 1) * 8}px`
                    : `${80 + (items.length - 1) * 32}px`,
                }}
              >
                {items.map((item, index) => {
                  const Wrapper = item.link ? 'a' : 'div'
                  const wrapperProps = item.link
                    ? {
                        href: item.link,
                        target: '_blank' as const,
                        rel: 'noopener noreferrer',
                      }
                    : {}

                  const topOffset = isExpanded
                    ? index * 98
                    : index * 32

                  return (
                    <Wrapper
                      key={`${item.type}-${item.title}-${index}`}
                      {...wrapperProps}
                      className={`
                        absolute inset-x-0
                        bg-white rounded-xl
                        border border-black/[0.06]
                        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]
                        p-3
                        transition-all duration-300 ease-out
                        hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]
                        hover:border-orange-500/30
                        ${item.link ? 'cursor-pointer' : ''}
                        ${!isExpanded && index > 0 ? 'hover:!translate-y-[-6px]' : ''}
                        group
                      `}
                      style={{
                        zIndex: items.length - index,
                        top: `${topOffset}px`,
                        opacity: isExpanded || index === 0 ? 1 : 0.9 - index * 0.05,
                      }}
                      onClick={e => {
                        if (!item.link && hasMultiple && !isExpanded) {
                          e.preventDefault()
                          setExpandedType(type)
                        }
                      }}
                    >
                      <h3 className="text-sm font-medium text-black leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-[11px] text-black/40 mt-1 truncate">
                          {item.subtitle}
                        </p>
                      )}
                      {item.context && isExpanded && (
                        <p className="text-[11px] text-orange-600/70 mt-1.5 italic line-clamp-2">
                          "{item.context}"
                        </p>
                      )}
                      {item.progress !== undefined && item.progress !== null && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-black/30 font-medium">
                            {item.progress}%
                          </span>
                        </div>
                      )}
                    </Wrapper>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
