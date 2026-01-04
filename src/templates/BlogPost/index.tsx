import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { parseISO, format } from 'date-fns'

import { Layout, Header, Footer } from '../../components'

interface BlogPostTemplateProps {
  frontmatter: {
    title: string
    date: string
    description?: string
    type?: string
  }
  content: string
  slug: string
}

const BlogPostTemplate = ({ frontmatter, content, slug }: BlogPostTemplateProps) => {
  const date = format(parseISO(frontmatter.date), 'MMMM dd, yyyy')
  const showDate = frontmatter.type !== 'permanent'

  return (
    <Layout title={frontmatter.title} description={frontmatter.description}>
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@juliancanderson" />
        <meta name="twitter:title" content={frontmatter.title} />
        <meta
          name="twitter:description"
          content={frontmatter.description || ''}
        />
      </Head>

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
          {frontmatter.title}
        </h1>

        {/* Date */}
        {showDate && (
          <time className="block font-mono text-xs text-text-muted uppercase tracking-widest mb-12">
            {date}
          </time>
        )}

        {/* Content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      <Footer />
    </Layout>
  )
}

export default BlogPostTemplate
