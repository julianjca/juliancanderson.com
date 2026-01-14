import { FloatingNav, Footer } from '@/components'
import { getStackItems, StackItem } from '@/lib/notion'
import { PageLayout } from '../components/PageLayout'

export const revalidate = 3600

export const metadata = {
  title: 'Stack',
  description:
    'The ideas, mental models, habits, and tools that power how I think and work.',
}

const categoryIcons: Record<string, string> = {
  Ideas: '💡',
  Systems: '⚙️',
  Tools: '🛠️',
}

const categoryDescriptions: Record<string, string> = {
  Ideas: 'Mental models and frameworks that shape how I think',
  Systems: 'Habits and routines that keep me productive',
  Tools: 'Software and methods I use for thinking and creating',
}

export default async function StackPage() {
  const items = await getStackItems()

  const categories = ['Ideas', 'Systems', 'Tools'] as const
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category)
    return acc
  }, {} as Record<string, StackItem[]>)

  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            My Toolkit
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Stack
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            The ideas, mental models, habits, and tools that power how I think
            and work. Not just tech - the full operating system.
          </p>
        </section>

        {categories.map((category, categoryIndex) => {
          const categoryItems = groupedItems[category]
          if (categoryItems.length === 0) return null

          return (
            <section
              key={category}
              className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
              style={{
                animationDelay: `${0.2 + categoryIndex * 0.1}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{categoryIcons[category]}</span>
                <h2 className="font-display text-2xl">{category}</h2>
              </div>
              <p className="text-black/40 text-sm mb-6">
                {categoryDescriptions[category]}
              </p>

              <div className="space-y-3">
                {categoryItems.map(item => (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl bg-white border border-black/5 hover:border-orange-500/20 transition-colors"
                  >
                    <h3 className="font-medium text-black mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-black/50">
                        {item.description}
                      </p>
                    )}
                    {item.source && (
                      <p className="text-xs text-black/30 mt-2 italic">
                        From: {item.source}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {items.length === 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="text-center py-16 text-black/40">
              <p className="text-lg mb-2">Stack coming soon...</p>
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
