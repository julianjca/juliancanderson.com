import React from 'react'
import Link from 'next/link'

interface BlogPost {
  title: string
  url: string
}

interface WritingCardProps {
  posts: BlogPost[]
  limit?: number
}

export const WritingCard = ({ posts, limit = 5 }: WritingCardProps) => {
  const displayPosts = posts.slice(0, limit)

  return (
    <div
      className="
        col-span-1 md:col-span-2 lg:col-span-4
        bg-white
        border border-black/5
        rounded-2xl
        p-6 md:p-8
        animate-slide-up opacity-0
      "
      style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-orange-500 rounded-full" />
          <h2 className="font-display text-2xl md:text-3xl text-black">Writing</h2>
        </div>
        <Link
          href="/blog"
          className="
            text-sm
            text-black/40
            hover:text-orange-500
            transition-colors
            flex
            items-center
            gap-1.5
            font-medium
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
        {displayPosts.map((post, index) => (
          <Link
            key={post.url}
            href={`/blog/${post.url}`}
            className="
              group
              flex
              items-center
              gap-4
              py-4
              transition-all
              duration-200
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
                shrink-0
                text-black/20
                opacity-0
                -translate-x-2
                group-hover:opacity-100
                group-hover:translate-x-0
                group-hover:text-orange-500
                transition-all
                duration-200
              "
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
