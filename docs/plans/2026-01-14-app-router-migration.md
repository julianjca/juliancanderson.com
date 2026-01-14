# Next.js App Router Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate juliancanderson.com from Next.js Pages Router (`src/pages/`) to App Router (`src/app/`) in one complete migration.

**Architecture:** Create `src/app/` directory with root layout merging `_app.tsx` and `_document.tsx`. Convert all pages to Server Components with async data fetching. Keep React Query for client-side refetching (Currently section). Migrate API routes to Route Handlers.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Query, Emotion, Notion API

---

## Pre-Migration Checklist

- [ ] Backup current state: `git checkout -b backup/pages-router`
- [ ] Ensure `next` is v13+ (currently v16.1.1 - OK)
- [ ] All tests pass (no tests currently)

---

## Task 1: Create App Directory Foundation

**Files:**

- Create: `src/app/layout.tsx`
- Create: `src/app/providers.tsx`
- Create: `src/app/metadata.ts`

**Step 1: Create root layout.tsx**

Create `src/app/layout.tsx`:

```tsx
import { Sora, Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import '../styles/globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Julian Christian Anderson',
    template: '%s - Julian Christian Anderson',
  },
  description:
    'Software engineer, writer, and learner. Building things on the internet.',
  keywords: [
    'julian christian anderson',
    'software engineer',
    'frontend developer',
    'writer',
    'indonesia',
  ],
  authors: [{ name: 'Julian Christian Anderson' }],
  creator: 'Julian Christian Anderson',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://juliancanderson.com',
    siteName: 'Julian Christian Anderson',
    title: 'Julian Christian Anderson',
    description:
      'Software engineer, writer, and learner. Building things on the internet.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@juliancanderson',
    creator: '@juliancanderson',
    title: 'Julian Christian Anderson',
    description:
      'Software engineer, writer, and learner. Building things on the internet.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
  metadataBase: new URL('https://juliancanderson.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-sans/style.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-mono/style.min.css"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body
        className={`${sora.variable} ${geist.variable} ${geistMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Step 2: Create providers.tsx (Client Component)**

Create `src/app/providers.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
```

**Step 3: Verify layout compiles**

Run: `pnpm dev`
Expected: App starts (pages still work via pages directory)

---

## Task 2: Create Shared Page Layout Component

**Files:**

- Create: `src/app/components/PageLayout.tsx`

**Step 1: Create PageLayout component**

This replaces the old `Layout` component for app router pages. Create `src/app/components/PageLayout.tsx`:

```tsx
import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return <div className="min-h-screen bg-background text-text">{children}</div>
}
```

---

## Task 3: Migrate Static Pages (No Data Fetching)

### Task 3a: Migrate About Page

**Files:**

- Create: `src/app/about/page.tsx`

**Step 1: Create about page**

Create `src/app/about/page.tsx`:

```tsx
import Link from 'next/link'
import { FloatingNav, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'

export const metadata = {
  title: 'About',
  description: 'About Julian Christian Anderson',
}

const pastWorks = [
  { name: 'Crypto College', url: 'https://cryptocollege.latecheckout.studio' },
  { name: 'Creatives Club', url: 'https://creatives.club' },
  { name: 'Thirty Days of Lunch', url: 'https://thirtydaysoflunch.com' },
  { name: 'Jumpcut', url: 'https://jumpcut.com' },
  {
    name: 'Jumpcut Art of The Startup',
    url: 'https://hawaii.jumpcut.com/aots/sales',
  },
  { name: 'Blibli.com', url: 'https://blibli.com' },
]

export default function AboutPage() {
  return (
    <PageLayout>
      <FloatingNav />
      <main className="pt-28 pb-24">
        {/* Hero Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide text-sm mb-4">
            About Me
          </p>

          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-8">
            Hey, I'm Julian
          </h1>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed">
            <p>
              I am an{' '}
              <strong className="text-black">
                Industrial Engineering Graduate
              </strong>{' '}
              that turned into a{' '}
              <strong className="text-black">Software Engineer</strong>. I
              rediscover my passion in tech in my last year of college and I
              went through an autodidact path when I first started. I mostly
              learned from articles and online courses.
            </p>

            <p>
              After a couple of months learning by myself I decided to enter a{' '}
              <strong className="text-black">Coding Bootcamp</strong> called{' '}
              <a
                href="https://hacktiv8.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Hacktiv8
              </a>
              .
            </p>

            <p>
              I am currently working at{' '}
              <a
                href="https://latecheckout.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Late Checkout
              </a>{' '}
              as a Software Engineer (Front End, Backend, and Web3). In 2021 I
              built a full stack web3 site called Crypto College. I wrote the
              Front End Code + the Smart Contract.
            </p>

            <p>
              Beside coding I also love doing some{' '}
              <a
                href="https://unsplash.com/@juliancanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                photography
              </a>{' '}
              and writing. I love to write because it helps me to learn better
              and it can also help people who will learn the same thing through
              my{' '}
              <a
                href="https://dev.to/juliancanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                articles
              </a>
              . I write <Link
                href="/blog"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                about things that I'm interested in
              </Link> too!
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="h-px bg-black/10" />
        </div>

        {/* Past Works Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Past & Present Works</h2>
          </div>

          <div className="space-y-0 divide-y divide-black/5">
            {pastWorks.map((work, index) => (
              <a
                key={work.name}
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-4 transition-all duration-200"
              >
                <span className="text-black/20 text-sm font-mono w-6 shrink-0 group-hover:text-orange-500 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-black group-hover:text-orange-500 transition-colors flex-1">
                  {work.name}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-black/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all duration-200"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section
          className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Stay Updated</h2>
          </div>

          <p className="text-black/60 text-lg mb-6 max-w-xl">
            Subscribe for future posts. I won't send you any spam. You can
            unsubscribe at any time.
          </p>

          <iframe
            src="https://juliancanderson.substack.com/embed"
            width="320"
            height="80"
            frameBorder="0"
            scrolling="no"
            title="substack"
            className="opacity-80"
          />
        </section>
      </main>
      <Footer />
    </PageLayout>
  )
}
```

### Task 3b: Migrate Contact Page

**Files:**

- Create: `src/app/contact/page.tsx`
- Reference: `src/pages/contact.tsx`

**Step 1: Create contact page**

Read the existing `src/pages/contact.tsx` and create `src/app/contact/page.tsx` with the same content, adding:

- `export const metadata = { title: 'Contact', description: '...' }`
- Replace `Layout` with `PageLayout`
- Remove any `getStaticProps` if present

### Task 3c: Migrate Subscribe Page

**Files:**

- Create: `src/app/subscribe/page.tsx`
- Reference: `src/pages/subscribe.tsx`

**Step 1: Create subscribe page**

Same pattern as contact page.

### Task 3d: Migrate Services Page

**Files:**

- Create: `src/app/services/page.tsx`
- Reference: `src/pages/services.tsx`

**Step 1: Create services page**

Same pattern as contact page.

### Task 3e: Migrate Work Page

**Files:**

- Create: `src/app/work/page.tsx`
- Reference: `src/pages/work.tsx`

**Step 1: Create work page**

Same pattern - work page has static JSON data embedded, no external fetching.

---

## Task 4: Migrate Notion-Powered Pages (getStaticProps -> Server Components)

### Task 4a: Migrate Uses Page

**Files:**

- Create: `src/app/uses/page.tsx`

**Step 1: Create uses page with server-side data fetching**

Create `src/app/uses/page.tsx`:

```tsx
import { FloatingNav, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'
import { getUsesItems, UsesCategory } from '@/lib/notion'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata = {
  title: 'Uses',
  description:
    'The physical things I use every day—hardware, desk setup, and gear.',
}

const categoryIcons: Record<string, string> = {
  Hardware: '💻',
  'Desk Setup': '🖥️',
  Audio: '🎧',
  Accessories: '⌨️',
  Travel: '✈️',
  Coffee: '☕',
  Other: '📦',
}

export default async function UsesPage() {
  const categories = await getUsesItems()

  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            Physical Things
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Uses
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            The physical things I use every day—my hardware, desk setup, and
            favorite gear. For software and mental tools, check out my{' '}
            <a href="/stack" className="text-orange-500 hover:underline">
              Stack
            </a>
            .
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
              {category.items.map(item => {
                const isLink = !!item.link

                return isLink ? (
                  <a
                    key={item.name}
                    href={item.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/5 hover:border-orange-500/30 hover:shadow-md cursor-pointer group transition-all duration-200"
                  >
                    <ItemContent item={item} category={category} hasLink />
                  </a>
                ) : (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/5"
                  >
                    <ItemContent
                      item={item}
                      category={category}
                      hasLink={false}
                    />
                  </div>
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
    </PageLayout>
  )
}

function ItemContent({
  item,
  category,
  hasLink,
}: {
  item: UsesCategory['items'][0]
  category: UsesCategory
  hasLink: boolean
}) {
  const categoryIcons: Record<string, string> = {
    Hardware: '💻',
    'Desk Setup': '🖥️',
    Audio: '🎧',
    Accessories: '⌨️',
    Travel: '✈️',
    Coffee: '☕',
    Other: '📦',
  }

  return (
    <>
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
              hasLink ? 'group-hover:text-orange-500 transition-colors' : ''
            }`}
          >
            {item.name}
          </h3>
          {hasLink && (
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
    </>
  )
}
```

### Task 4b: Migrate Stack Page

**Files:**

- Create: `src/app/stack/page.tsx`
- Reference: `src/pages/stack.tsx`

**Step 1: Create stack page**

Same pattern as uses - async Server Component with `getStackItems()`.

### Task 4c: Migrate Influences Page

**Files:**

- Create: `src/app/influences/page.tsx`
- Reference: `src/pages/influences.tsx`

**Step 1: Create influences page**

Same pattern with `getInfluencesItems()`.

### Task 4d: Migrate Changelog Page

**Files:**

- Create: `src/app/changelog/page.tsx`
- Reference: `src/pages/changelog.tsx`

**Step 1: Create changelog page**

Same pattern with `getChangelogItems()`.

### Task 4e: Migrate Bookshelf Page

**Files:**

- Create: `src/app/bookshelf/page.tsx`
- Reference: `src/pages/bookshelf.tsx`

**Step 1: Create bookshelf page**

Same pattern with `getBookshelfItems()`. Note: This is a larger page with multiple sub-components (Book3D, StarRating). Keep them in the same file or extract to `src/app/bookshelf/components/`.

---

## Task 5: Migrate Blog Pages

### Task 5a: Migrate Blog Index Page

**Files:**

- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/BlogList.tsx` (Client Component for filtering)

**Step 1: Create blog list client component**

Create `src/app/blog/BlogList.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Post {
  slug: string
  frontmatter: {
    title: string
    tags?: string[]
    type?: string
  }
}

interface BlogListProps {
  posts: Post[]
  allTags: string[]
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = posts
    .filter(
      post =>
        post.slug !== 'now' &&
        post.slug !== 'bookshelf' &&
        post.frontmatter.type !== 'quantified-project' &&
        post.frontmatter.type !== 'permanent'
    )
    .filter(post => {
      if (!selectedTag) return true
      const tags = post.frontmatter.tags || []
      return tags.includes(selectedTag)
    })

  return (
    <>
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div
          className="mb-8 animate-slide-up opacity-0"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedTag === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-black/5 text-black/60 hover:bg-black/10'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-orange-500 text-white'
                    : 'bg-black/5 text-black/60 hover:bg-black/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-1">
        {filteredPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={'/blog/' + post.slug}
            className="group flex items-center gap-4 py-3 -mx-3 px-3 rounded-lg hover:bg-black/5 transition-colors animate-slide-up opacity-0"
            style={{
              animationDelay: `${0.2 + index * 0.03}s`,
              animationFillMode: 'forwards',
            }}
          >
            <span className="text-xs text-black/30 font-mono w-5">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <span className="text-black group-hover:text-orange-500 transition-colors">
                {post.frontmatter.title}
              </span>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="flex gap-1.5 mt-1">
                  {post.frontmatter.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-black/40 bg-black/5 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 text-black/40">
          <p>No posts found for this tag.</p>
        </div>
      )}
    </>
  )
}
```

**Step 2: Create blog index page**

Create `src/app/blog/page.tsx`:

```tsx
import { FloatingNav, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { BlogList } from './BlogList'

export const metadata = {
  title: 'Writing',
  description: 'Thoughts on engineering, product, and learning.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const allTags = getAllTags()

  return (
    <PageLayout>
      <FloatingNav />
      <main className="pt-24 pb-16">
        <section className="px-6 max-w-3xl mx-auto">
          {/* Header */}
          <div
            className="mb-8 animate-slide-up opacity-0"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <h1 className="font-display text-4xl md:text-5xl mb-4">Writing</h1>
            <p className="text-black/60 text-lg">
              Thoughts on engineering, learning, and things I find interesting.
            </p>
          </div>

          <BlogList posts={posts} allTags={allTags} />
        </section>
      </main>
      <Footer />
    </PageLayout>
  )
}
```

### Task 5b: Migrate Dynamic Blog Post Page

**Files:**

- Create: `src/app/blog/[slug]/page.tsx`

**Step 1: Create dynamic blog post page**

Create `src/app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { parseISO, format } from 'date-fns'
import remark from 'remark'
import html from 'remark-html'

import { FloatingNav, Footer, Header } from '@/components'
import { PageLayout } from '../../components/PageLayout'
import { getPostBySlug, getAllPosts } from '@/lib/blog'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params

  try {
    const post = getPostBySlug(slug)
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description || '',
      twitter: {
        card: 'summary',
        site: '@juliancanderson',
        title: post.frontmatter.title,
        description: post.frontmatter.description || '',
      },
    }
  } catch {
    return {
      title: 'Post Not Found',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    notFound()
  }

  const markdown = await remark()
    .use(html)
    .process(post.content || '')
  const content = markdown.toString()

  const date = format(parseISO(post.frontmatter.date), 'MMMM dd, yyyy')
  const showDate = post.frontmatter.type !== 'permanent'

  return (
    <PageLayout>
      <Header />

      <article className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16 animate-fade-in">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-8"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all posts
        </Link>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-text mb-4">
          {post.frontmatter.title}
        </h1>

        {/* Date */}
        {showDate && (
          <time className="block font-mono text-xs text-text-muted uppercase tracking-widest mb-12">
            {date}
          </time>
        )}

        {/* Content */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      <Footer />
    </PageLayout>
  )
}
```

### Task 5c: Migrate Now Page

**Files:**

- Create: `src/app/now/page.tsx`

**Step 1: Create now page**

Create `src/app/now/page.tsx`:

```tsx
import Link from 'next/link'
import { parseISO, format } from 'date-fns'
import remark from 'remark'
import html from 'remark-html'

import { FloatingNav, Footer, Header } from '@/components'
import { PageLayout } from '../components/PageLayout'
import { getPostBySlug } from '@/lib/blog'

export const metadata = {
  title: 'Now',
  description: "What I'm currently focused on.",
}

export default async function NowPage() {
  const post = getPostBySlug('now')

  const markdown = await remark()
    .use(html)
    .process(post.content || '')
  const content = markdown.toString()

  const date = format(parseISO(post.frontmatter.date), 'MMMM dd, yyyy')
  const showDate = post.frontmatter.type !== 'permanent'

  return (
    <PageLayout>
      <Header />

      <article className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16 animate-fade-in">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-8"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all posts
        </Link>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-text mb-4">
          {post.frontmatter.title}
        </h1>

        {showDate && (
          <time className="block font-mono text-xs text-text-muted uppercase tracking-widest mb-12">
            {date}
          </time>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      <Footer />
    </PageLayout>
  )
}
```

---

## Task 6: Migrate Homepage

**Files:**

- Create: `src/app/page.tsx`
- Create: `src/app/HomeContent.tsx` (for client-side parts)

**Step 1: Create homepage**

Create `src/app/page.tsx`:

```tsx
import Link from 'next/link'

import { FloatingNav, Footer, CurrentlySection } from '@/components'
import { PageLayout } from './components/PageLayout'
import { getAllPostsMeta, getFeaturedPosts } from '@/lib/blog'
import { getCurrentlyItems } from '@/lib/notion'

export const revalidate = 3600 // ISR: revalidate every hour

const interests = [
  { emoji: '🎨', label: 'Design Systems' },
  { emoji: '🤖', label: 'AI & LLMs' },
  { emoji: '📱', label: 'Mobile Apps' },
  { emoji: '🎮', label: 'Video Games' },
  { emoji: '📚', label: 'Learning' },
  { emoji: '✈️', label: 'Travel' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '☕', label: 'Coffee' },
]

const socialLinks = [
  {
    href: 'https://github.com/julianjca',
    label: 'GitHub',
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com/juliancanderson',
    label: 'Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.6.75h2.454l-5.36 6.126L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.554L0 .75h5.063l3.495 4.622L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
  {
    href: 'mailto:hello@juliancanderson.com',
    label: 'Email',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export default async function HomePage() {
  const posts = getAllPostsMeta()
  const featuredPosts = getFeaturedPosts()
  const currentlyItems = await getCurrentlyItems()

  const blogPosts = posts
    .filter(
      post =>
        post.slug !== 'now' &&
        post.slug !== 'bookshelf' &&
        post.frontmatter.type !== 'quantified-project' &&
        post.frontmatter.type !== 'permanent'
    )
    .map(post => ({
      title: post.frontmatter.title,
      url: post.slug,
    }))

  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        {/* Hero Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-24 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide text-sm mb-4">
            Software Engineer
          </p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
            Hey, I'm Julian
            <span
              className="inline-block ml-3 origin-[70%_70%]"
              style={{ animation: 'wave 2.5s ease-in-out infinite' }}
            >
              👋
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-black/60 leading-relaxed max-w-2xl">
            Building products at{' '}
            <a
              href="https://latecheckout.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5"
            >
              Late Checkout
            </a>
            . I write about engineering, learning, and the things that spark my curiosity.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-10">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center
                  w-12 h-12
                  rounded-full
                  border border-black/10
                  text-black/50
                  hover:border-orange-500
                  hover:text-orange-500
                  hover:bg-orange-50
                  transition-all duration-200
                "
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="h-px bg-black/10" />
        </div>

        <CurrentlySection initialItems={currentlyItems} />

        {/* Interests Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Things I Love</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {interests.map(interest => (
              <div
                key={interest.label}
                className="
                  flex items-center gap-2 px-4 py-2.5
                  bg-white border border-black/5 rounded-full
                  hover:border-orange-500/30 hover:bg-orange-50/50
                  transition-all duration-200
                "
              >
                <span className="text-lg">{interest.emoji}</span>
                <span className="text-sm font-medium text-black/70">
                  {interest.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Writing Section */}
        {featuredPosts.length > 0 && (
          <section
            className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
            style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <h2 className="font-display text-3xl">Featured</h2>
            </div>

            <div className="grid gap-4">
              {featuredPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="
                    group block p-6
                    bg-gradient-to-br from-orange-50 to-amber-50
                    border border-orange-100
                    rounded-2xl
                    hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50
                    transition-all duration-300
                  "
                >
                  <h3 className="text-xl font-semibold text-black group-hover:text-orange-600 transition-colors mb-2">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-black/60 line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Writing Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <h2 className="font-display text-3xl">Writing</h2>
            </div>
            <Link
              href="/blog"
              className="
                text-sm text-black/40 hover:text-orange-500
                transition-colors flex items-center gap-1.5 font-medium
              "
            >
              View all
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-0 divide-y divide-black/5">
            {blogPosts.slice(0, 5).map((post, index) => (
              <Link
                key={post.url}
                href={`/blog/${post.url}`}
                className="
                  group flex items-center gap-4 py-4
                  transition-all duration-200
                "
              >
                <span className="text-black/20 text-sm font-mono w-6 shrink-0 group-hover:text-orange-500 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-black group-hover:text-orange-500 transition-colors flex-1">
                  {post.title}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="
                    shrink-0 text-black/20
                    opacity-0 -translate-x-2
                    group-hover:opacity-100 group-hover:translate-x-0
                    group-hover:text-orange-500
                    transition-all duration-200
                  "
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Connect Section */}
        <section
          className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Let's Connect</h2>
          </div>

          <p className="text-black/60 text-lg mb-6 max-w-xl">
            I'm always happy to chat about product, engineering, or anything
            interesting. Feel free to reach out!
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:hello@juliancanderson.com"
              className="
                inline-flex items-center gap-2 px-5 py-3
                bg-orange-500 text-white rounded-full
                hover:bg-orange-600 transition-colors
                font-medium text-sm
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Send an email
            </a>
            <a
              href="https://twitter.com/juliancanderson"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-5 py-3
                border border-black/10 text-black rounded-full
                hover:border-orange-500 hover:text-orange-500
                transition-colors font-medium text-sm
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M12.6.75h2.454l-5.36 6.126L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.554L0 .75h5.063l3.495 4.622L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
              </svg>
              Follow on Twitter
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </PageLayout>
  )
}
```

---

## Task 7: Migrate API Routes to Route Handlers

### Task 7a: Migrate Currently API

**Files:**

- Create: `src/app/api/currently/route.ts`

**Step 1: Create currently route handler**

Create `src/app/api/currently/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getCurrentlyItems } from '@/lib/notion'

export async function GET() {
  try {
    const items = await getCurrentlyItems()

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching currently items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}
```

### Task 7b: Migrate Revalidate API

**Files:**

- Create: `src/app/api/revalidate/route.ts`

**Step 1: Create revalidate route handler**

Create `src/app/api/revalidate/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get('secret') ||
    request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get('path')

  try {
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }

    // Revalidate all main pages
    const paths = ['/', '/bookshelf', '/blog', '/uses']

    for (const p of paths) {
      try {
        revalidatePath(p)
      } catch {
        // Page might not exist, continue
      }
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
```

---

## Task 8: Update Components for App Router Compatibility

### Task 8a: Mark Client Components

**Files:**

- Modify: `src/components/CurrentlySection/index.tsx`
- Modify: `src/components/FloatingNav/index.tsx` (if it uses hooks)

**Step 1: Add 'use client' directive to CurrentlySection**

The CurrentlySection uses `useState` and `useQuery`, so it needs 'use client':

Add at the top of `src/components/CurrentlySection/index.tsx`:

```tsx
'use client'
```

**Step 2: Check FloatingNav and other interactive components**

Any component using:

- `useState`, `useEffect`, `useReducer`, etc.
- `useQuery` from React Query
- Browser APIs
- Event handlers (onClick, etc.) that manage state

Must have `'use client'` at the top.

---

## Task 9: Delete Pages Directory & Clean Up

**Files:**

- Delete: `src/pages/` (entire directory)
- Delete: `src/templates/BlogPost/index.tsx` (no longer needed)

**Step 1: Verify all routes work**

Run: `pnpm dev`

Test all routes manually:

- `/` - Homepage
- `/about` - About page
- `/blog` - Blog list
- `/blog/[any-slug]` - Blog post
- `/bookshelf` - Bookshelf
- `/uses` - Uses
- `/stack` - Stack
- `/influences` - Influences
- `/changelog` - Changelog
- `/now` - Now
- `/work` - Work
- `/contact` - Contact
- `/subscribe` - Subscribe
- `/services` - Services
- `/api/currently` - API endpoint
- `/api/revalidate` - API endpoint (with secret)

**Step 2: Delete old files**

```bash
rm -rf src/pages
rm -rf src/templates
```

**Step 3: Remove unused imports from components**

Update `src/components/index.js` if needed - remove Layout export since we now use PageLayout in app directory.

---

## Task 10: Final Build & Test

**Step 1: Run production build**

Run: `pnpm build`

Expected: Build succeeds without errors

**Step 2: Test production server**

Run: `pnpm start`

Test all routes work in production mode.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: migrate from pages router to app router

- Create src/app directory with root layout
- Convert all pages to Server Components
- Migrate API routes to Route Handlers
- Keep React Query for client-side data refetching
- Implement ISR with revalidate exports
- Add generateStaticParams for dynamic routes
- Update metadata using Next.js metadata API
- Remove deprecated pages directory"
```

---

## Migration Summary

| Old (Pages Router)           | New (App Router)                               |
| ---------------------------- | ---------------------------------------------- |
| `src/pages/_app.tsx`         | `src/app/layout.tsx` + `src/app/providers.tsx` |
| `src/pages/_document.tsx`    | `src/app/layout.tsx` (merged)                  |
| `src/pages/index.tsx`        | `src/app/page.tsx`                             |
| `src/pages/about.tsx`        | `src/app/about/page.tsx`                       |
| `src/pages/blog/index.tsx`   | `src/app/blog/page.tsx`                        |
| `src/pages/blog/[slug].tsx`  | `src/app/blog/[slug]/page.tsx`                 |
| `src/pages/api/currently.ts` | `src/app/api/currently/route.ts`               |
| `getStaticProps`             | async Server Component + `revalidate`          |
| `getStaticPaths`             | `generateStaticParams()`                       |
| `next/head` in components    | `metadata` export / `generateMetadata()`       |

---

## Rollback Plan

If issues arise:

1. `git checkout backup/pages-router`
2. `pnpm install`
3. `pnpm dev`

The backup branch preserves the working Pages Router implementation.
