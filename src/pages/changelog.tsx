import * as React from 'react'
import { Layout, FloatingNav, Footer } from '../components'
import { getChangelogItems, ChangelogItem } from '../lib/notion'

interface ChangelogPageProps {
  items: ChangelogItem[]
}

const typeConfig: Record<ChangelogItem['type'], { emoji: string; color: string }> = {
  update: { emoji: '📝', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  win: { emoji: '🎉', color: 'bg-green-50 text-green-600 border-green-200' },
  lesson: { emoji: '💡', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  pivot: { emoji: '🔄', color: 'bg-purple-50 text-purple-600 border-purple-200' },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ChangelogPage({ items }: ChangelogPageProps) {
  return (
    <Layout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            Life Updates
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Changelog
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            A running log of updates, wins, lessons, and pivots. More informal than
            a blog, more structured than Twitter.
          </p>
        </section>

        {items.length > 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-black/10" />

              {/* Entries */}
              <div className="space-y-8">
                {items.map((item, index) => {
                  const config = typeConfig[item.type]

                  return (
                    <div
                      key={`${item.date}-${item.title}`}
                      className="relative pl-12 animate-slide-up opacity-0"
                      style={{
                        animationDelay: `${0.2 + index * 0.05}s`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${config.color}`}
                        >
                          {config.emoji}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="pb-8 border-b border-black/5 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-black/40 font-mono">
                            {formatDate(item.date)}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${config.color}`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-black mb-1">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="text-black/60">{item.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {items.length === 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="text-center py-16 text-black/40">
              <p className="text-lg mb-2">Changelog coming soon...</p>
              <p className="text-sm">
                Setting up the Notion database. Check back soon!
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const items = await getChangelogItems()

  return {
    props: {
      items,
    },
    revalidate: 3600,
  }
}
