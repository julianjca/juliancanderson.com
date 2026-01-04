import React from 'react'
import Link from 'next/link'

interface Post {
  title: string
  url: string
}

interface BlogPostProps {
  title?: string
  blogs: Post[]
  showViewAll?: boolean
  limit?: number
}

const BlogpostsList = ({
  blogs,
  title = 'Writing',
  showViewAll = true,
  limit,
}: BlogPostProps) => {
  const displayedBlogs = limit ? blogs.slice(0, limit) : blogs

  if (!blogs || blogs.length === 0) {
    return (
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl text-text mb-6">{title}</h2>
        <p className="text-text-muted text-sm">No posts yet.</p>
      </section>
    )
  }

  return (
    <section className="px-6 pb-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-text">{title}</h2>
        {showViewAll && blogs.length > (limit || 0) && (
          <Link
            href="/blog"
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="space-y-1">
        {displayedBlogs.map((blog, index) => (
          <Link
            key={blog.url}
            href={'/blog/' + blog.url}
            className="group flex items-center gap-4 py-3 -mx-3 px-3 rounded-lg hover:bg-background-elevated transition-colors animate-slide-up opacity-0"
            style={{
              animationDelay: `${0.3 + index * 0.05}s`,
              animationFillMode: 'forwards',
            }}
          >
            <span className="text-xs text-text-muted font-mono w-5">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className="flex-1 text-text group-hover:text-accent transition-colors"
              dangerouslySetInnerHTML={{ __html: blog.title }}
            />
            <span className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BlogpostsList
