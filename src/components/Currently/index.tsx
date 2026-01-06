import React from 'react'

export interface CurrentlyItem {
  type:
    | 'reading'
    | 'watching'
    | 'playing'
    | 'researching'
    | 'listening'
    | 'building'
  title: string
  subtitle: string | null
  link: string | null
  progress: number | null
  context: string | null
}

interface CurrentlyProps {
  items: CurrentlyItem[]
}

const typeEmojis: Record<CurrentlyItem['type'], string> = {
  reading: '📚',
  watching: '📺',
  playing: '🎮',
  researching: '🔍',
  listening: '🎧',
  building: '🛠',
}

const labels: Record<CurrentlyItem['type'], string> = {
  reading: 'Reading',
  watching: 'Watching',
  playing: 'Playing',
  researching: 'Researching',
  listening: 'Listening',
  building: 'Building',
}

export const Currently = ({ items }: CurrentlyProps) => {
  if (!items || items.length === 0) return null

  return (
    <section className="px-6 pb-16 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl text-text mb-6">Currently</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex items-start gap-3 p-4 rounded-xl border border-border hover:border-text-muted/30 hover:bg-background-elevated transition-all animate-slide-up opacity-0"
            style={{
              animationDelay: `${0.2 + index * 0.05}s`,
              animationFillMode: 'forwards',
            }}
          >
            <span className="text-xl">{typeEmojis[item.type]}</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-muted uppercase tracking-wide">
                {labels[item.type]}
              </span>
              <h3 className="text-sm font-medium text-text truncate">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              {item.subtitle && (
                <p className="text-xs text-text-muted truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
