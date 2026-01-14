import { FloatingNav, Footer } from '@/components'
import { getInfluencesItems, InfluenceItem } from '@/lib/notion'
import { PageLayout } from '../components/PageLayout'

export const revalidate = 3600

export const metadata = {
  title: 'Influences',
  description:
    'The people, books, ideas, and works that have shaped how I think and what I build.',
}

const typeIcons: Record<string, string> = {
  Person: '👤',
  Book: '📚',
  Concept: '💭',
  Work: '🎨',
}

const typeDescriptions: Record<string, string> = {
  Person: 'People who have shaped my thinking',
  Book: 'Books that changed my perspective',
  Concept: 'Ideas and mental models I return to',
  Work: 'Projects and creations I admire',
}

export default async function InfluencesPage() {
  const items = await getInfluencesItems()

  const types = ['Person', 'Book', 'Concept', 'Work'] as const
  const groupedItems = types.reduce((acc, type) => {
    acc[type] = items.filter(item => item.type === type)
    return acc
  }, {} as Record<string, InfluenceItem[]>)

  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            Who Shaped Me
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Influences
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            The people, books, ideas, and works that have shaped how I think and
            what I build. A collection of inspirations I keep coming back to.
          </p>
        </section>

        {types.map((type, typeIndex) => {
          const typeItems = groupedItems[type]
          if (typeItems.length === 0) return null

          return (
            <section
              key={type}
              className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
              style={{
                animationDelay: `${0.2 + typeIndex * 0.1}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{typeIcons[type]}</span>
                <h2 className="font-display text-2xl">
                  {type === 'Person' ? 'People' : type + 's'}
                </h2>
              </div>
              <p className="text-black/40 text-sm mb-6">
                {typeDescriptions[type]}
              </p>

              <div className="space-y-3">
                {typeItems.map(item => {
                  const Wrapper = item.link ? 'a' : 'div'
                  const wrapperProps = item.link
                    ? {
                        href: item.link,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {}

                  return (
                    <Wrapper
                      key={item.name}
                      {...wrapperProps}
                      className={`block p-4 rounded-xl bg-white border border-black/5 transition-all ${
                        item.link
                          ? 'hover:border-orange-500/20 hover:shadow-md cursor-pointer group'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className={`font-medium text-black ${
                              item.link
                                ? 'group-hover:text-orange-500 transition-colors'
                                : ''
                            }`}
                          >
                            {item.name}
                          </h3>
                          {item.why && (
                            <p className="text-sm text-black/50 mt-1">
                              {item.why}
                            </p>
                          )}
                        </div>
                        {item.link && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-black/20 group-hover:text-orange-500 transition-colors shrink-0 mt-1"
                          >
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        )}
                      </div>
                    </Wrapper>
                  )
                })}
              </div>
            </section>
          )
        })}

        {items.length === 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="text-center py-16 text-black/40">
              <p className="text-lg mb-2">Influences coming soon...</p>
              <p className="text-sm">
                Setting up the Notion database. Check back soon!
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </PageLayout>
  )
}
