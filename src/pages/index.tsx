import * as React from 'react'
import Link from 'next/link'

import { Layout, FloatingNav, Footer, CurrentlySection } from '../components'
import { getAllPostsMeta } from '../lib/blog'
import { getCurrentlyItems } from '../lib/notion'
import type { CurrentlyItem } from '../components/Currently'

interface FrontMatter {
  type: string
  title: string
  description: string
  date: string
}

interface Post {
  slug: string
  frontmatter: FrontMatter
}

type HomePageProps = {
  data: Post[]
  currentlyItems: CurrentlyItem[]
}

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

const HomePage = ({ data, currentlyItems }: HomePageProps) => {
  const blogPosts = data
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
    <Layout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        {/* Hero Section - Full Width, Magazine Style */}
        <section
          className="max-w-3xl mx-auto px-6 mb-24 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
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
            . I write about engineering, learning, and the things that spark my
            curiosity.
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
    </Layout>
  )
}

export const getStaticProps = async () => {
  const posts = getAllPostsMeta()
  const currentlyItems = await getCurrentlyItems()

  return {
    props: {
      data: posts,
      currentlyItems,
    },
    revalidate: 3600,
  }
}

export default HomePage
