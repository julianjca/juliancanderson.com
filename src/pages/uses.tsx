import * as React from 'react'
import { Layout, FloatingNav, Footer } from '../components'
import { getUsesItems, UsesCategory } from '../lib/notion'

interface UsesPageProps {
  categories: UsesCategory[]
}

const categoryIcons: Record<string, string> = {
  'Hardware': '💻',
  'Software': '🖥️',
  'Dev Tools': '⚡',
  'Productivity': '📋',
  'Design': '🎨',
  'Audio': '🎧',
  'Other': '📦',
}

export default function UsesPage({ categories }: UsesPageProps) {
  return (
    <Layout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            My Setup
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Uses
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            A collection of the tools, apps, and gear I use daily for development,
            productivity, and life in general.
          </p>
        </section>

        {categories.map((category, categoryIndex) => (
          <section
            key={category.name}
            className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
            style={{
              animationDelay: `${0.2 + categoryIndex * 0.1}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">
                {categoryIcons[category.name] || categoryIcons['Other']}
              </span>
              <h2 className="font-display text-2xl">{category.name}</h2>
            </div>

            <div className="space-y-3">
              {category.items.map((item) => {
                const Wrapper = item.link ? 'a' : 'div'
                const wrapperProps = item.link
                  ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                  : {}

                return (
                  <Wrapper
                    key={item.name}
                    {...wrapperProps}
                    className={`
                      flex items-start gap-4 p-4 rounded-xl
                      bg-white border border-black/5
                      ${item.link ? 'hover:border-orange-500/30 hover:shadow-md cursor-pointer group transition-all duration-200' : ''}
                    `}
                  >
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-black/5 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="text-lg">
                          {categoryIcons[category.name] || '📦'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium text-black ${
                            item.link ? 'group-hover:text-orange-500 transition-colors' : ''
                          }`}
                        >
                          {item.name}
                        </h3>
                        {item.link && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-black/20 group-hover:text-orange-500 transition-colors"
                          >
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-black/50 mt-1">{item.description}</p>
                      )}
                    </div>
                  </Wrapper>
                )
              })}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="text-center py-16 text-black/40">
              <p>No items yet. Check back soon!</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const categories = await getUsesItems()

  return {
    props: {
      categories,
    },
    revalidate: 3600,
  }
}
