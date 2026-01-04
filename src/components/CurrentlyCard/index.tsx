import React from 'react'

export interface CurrentlyItemProps {
  type: 'reading' | 'watching' | 'playing' | 'researching' | 'listening' | 'building'
  title: string
  subtitle?: string
  link?: string
  progress?: number
  delay?: number
}

const typeConfig: Record<CurrentlyItemProps['type'], { emoji: string; label: string; color: string }> = {
  reading: { emoji: '📚', label: 'Reading', color: 'bg-orange-500' },
  watching: { emoji: '📺', label: 'Watching', color: 'bg-black' },
  playing: { emoji: '🎮', label: 'Playing', color: 'bg-black' },
  researching: { emoji: '🔍', label: 'Researching', color: 'bg-orange-500' },
  listening: { emoji: '🎧', label: 'Listening', color: 'bg-black' },
  building: { emoji: '🛠', label: 'Building', color: 'bg-orange-500' },
}

export const CurrentlyCard = ({
  type,
  title,
  subtitle,
  link,
  progress,
  delay = 0,
}: CurrentlyItemProps) => {
  const config = typeConfig[type]

  const Wrapper = link ? 'a' : 'div'
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`
        col-span-1
        bg-white
        border border-black/5
        rounded-2xl
        p-5
        flex flex-col
        transition-all duration-300
        animate-slide-up opacity-0
        ${link ? 'hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-lg cursor-pointer group' : ''}
      `}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center text-sm`}>
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] text-black/40 uppercase tracking-wider font-medium">
            {config.label}
          </span>
          <h3 className={`text-sm font-medium text-black mt-0.5 leading-snug ${link ? 'group-hover:text-orange-500 transition-colors' : ''}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-black/50 mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-black/40 mt-1.5 block font-medium">{progress}% complete</span>
        </div>
      )}
    </Wrapper>
  )
}
