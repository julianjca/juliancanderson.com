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
