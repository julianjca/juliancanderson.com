import Link from 'next/link'
import { parseISO, format } from 'date-fns'
import remark from 'remark'
import html from 'remark-html'

import { FloatingNav, Footer } from '@/components'
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
      <FloatingNav />

      <article className="max-w-2xl mx-auto px-4 md:px-8 pt-28 pb-16 animate-fade-in">
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
