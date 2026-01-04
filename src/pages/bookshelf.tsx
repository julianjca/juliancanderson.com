import * as React from 'react'
import { Layout, FloatingNav, Footer } from '../components'
import { getBookshelfItems, BookItem } from '../lib/notion'

// JSON fallback
import booksData from '../content/books.json'

interface BookshelfPageProps {
  books: BookItem[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={star <= rating ? 'text-orange-500' : 'text-black/15'}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

// 3D Book component with hover effects
function Book3D({
  title,
  author,
  color,
  index,
  hasLink
}: {
  title: string
  author: string
  color: string
  index: number
  hasLink: boolean
}) {
  return (
    <div
      className="group perspective-[1000px] cursor-pointer"
      style={{
        animationDelay: `${0.1 + index * 0.05}s`,
      }}
    >
      <div
        className={`
          relative w-14 h-48
          transform-gpu transition-all duration-500 ease-out
          group-hover:-translate-y-4 group-hover:rotate-y-[-15deg]
          preserve-3d
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book Spine (front face) */}
        <div
          className={`
            absolute inset-0 ${color} rounded-r-sm
            flex items-center justify-center
            shadow-xl
          `}
          style={{
            transform: 'translateZ(8px)',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.3), inset -3px 0 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Spine text */}
          <span
            className="text-white/90 text-[9px] font-medium tracking-wide whitespace-nowrap absolute px-2"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              maxHeight: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>

          {/* Spine details */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/20" />
          <div className="absolute right-0 top-4 bottom-4 w-[1px] bg-black/20" />

          {/* Top/bottom decoration */}
          <div className="absolute top-2 left-2 right-2 h-[1px] bg-white/10" />
          <div className="absolute bottom-2 left-2 right-2 h-[1px] bg-white/10" />
        </div>

        {/* Book side (3D depth) */}
        <div
          className="absolute top-0 right-0 w-4 h-full bg-gradient-to-r from-stone-100 to-stone-200"
          style={{
            transform: 'rotateY(90deg) translateZ(6px) translateX(8px)',
            transformOrigin: 'right',
          }}
        >
          {/* Page lines */}
          <div className="absolute inset-y-2 left-1 right-1 flex flex-col justify-evenly">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-[0.5px] bg-stone-300" />
            ))}
          </div>
        </div>

        {/* Hover tooltip */}
        <div
          className="
            absolute -top-20 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            transition-all duration-300 delay-100
            pointer-events-none z-50
            whitespace-nowrap
          "
        >
          <div className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow-xl">
            <p className="font-medium">{title}</p>
            <p className="text-white/60 text-[10px] mt-0.5">{author}</p>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
        </div>

        {/* Glow effect on hover */}
        {hasLink && (
          <div
            className="
              absolute inset-0 rounded-r-sm
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              pointer-events-none
            "
            style={{
              boxShadow: '0 0 30px rgba(249, 115, 22, 0.4)',
            }}
          />
        )}
      </div>
    </div>
  )
}

const spineColors = [
  'bg-zinc-900',
  'bg-orange-500',
  'bg-stone-700',
  'bg-orange-600',
  'bg-neutral-800',
  'bg-amber-700',
  'bg-stone-800',
  'bg-orange-700',
]

export default function BookshelfPage({ books }: BookshelfPageProps) {
  const currentlyReading = books.filter(b => b.status === 'reading')
  const completed = books.filter(b => b.status === 'completed')
  const wantToRead = books.filter(b => b.status === 'want-to-read')

  // Calculate stats
  const totalBooks = completed.length
  const avgRating = completed.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) /
    completed.filter(b => b.rating).length || 0

  return (
    <Layout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide mb-4 text-sm">
            Reading List
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
            Bookshelf
          </h1>
          <p className="text-xl md:text-2xl text-black/60 leading-relaxed max-w-2xl">
            A curated collection of books that shaped my thinking.
          </p>
        </section>

        {/* Stats Bar */}
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-8 py-6 border-y border-black/5">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-black">{totalBooks}</span>
              <span className="text-sm text-black/40 leading-tight">books<br/>completed</span>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-orange-500">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-black/40 leading-tight">average<br/>rating</span>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-black">{currentlyReading.length}</span>
              <span className="text-sm text-black/40 leading-tight">currently<br/>reading</span>
            </div>
          </div>
        </section>

        {/* 3D Bookshelf */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          {/* Shelf */}
          <div className="relative">
            {/* Books */}
            <div className="flex items-end justify-center gap-2 pb-4 flex-wrap">
              {books.slice(0, 8).map((book, i) => (
                <Book3D
                  key={book.title}
                  title={book.title}
                  author={book.author}
                  color={spineColors[i % spineColors.length]}
                  index={i}
                  hasLink={!!book.link}
                />
              ))}
            </div>

            {/* Wooden shelf */}
            <div
              className="h-4 rounded-sm relative"
              style={{
                background: 'linear-gradient(to bottom, #8B7355 0%, #6B5344 50%, #5C4636 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Wood grain texture */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 20px,
                    rgba(0,0,0,0.1) 20px,
                    rgba(0,0,0,0.1) 21px
                  )`,
                }}
              />
            </div>

            {/* Shelf bracket left */}
            <div
              className="absolute -bottom-6 left-4 w-3 h-6 bg-stone-600 rounded-b-sm"
              style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
            />
            {/* Shelf bracket right */}
            <div
              className="absolute -bottom-6 right-4 w-3 h-6 bg-stone-600 rounded-b-sm"
              style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
            />
          </div>
        </section>

        {/* Currently Reading - Featured */}
        {currentlyReading.length > 0 && (
          <section
            className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <h2 className="font-display text-3xl">Currently Reading</h2>
            </div>

            <div className="space-y-6">
              {currentlyReading.map((book, index) => {
                const Wrapper = book.link ? 'a' : 'div'
                const wrapperProps = book.link
                  ? { href: book.link, target: '_blank', rel: 'noopener noreferrer' }
                  : {}

                return (
                  <Wrapper
                    key={book.title}
                    {...wrapperProps}
                    className={`
                      group block relative overflow-hidden
                      p-8 md:p-10 rounded-3xl
                      bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800
                      text-white
                      ${book.link ? 'cursor-pointer' : ''}
                    `}
                  >
                    {/* Animated gradient border on hover */}
                    <div
                      className="
                        absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500
                      "
                      style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.3) 0%, transparent 50%, rgba(249,115,22,0.1) 100%)',
                      }}
                    />

                    {/* Floating particles effect */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-700" />
                    <div className="absolute bottom-10 left-20 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-colors duration-700 delay-100" />

                    <div className="relative flex items-start gap-8">
                      {/* Book cover placeholder with 3D effect */}
                      <div
                        className="
                          w-24 h-36 shrink-0 rounded-lg
                          bg-gradient-to-br from-orange-400 to-orange-600
                          flex items-center justify-center
                          transform group-hover:scale-105 group-hover:-rotate-3
                          transition-transform duration-500
                          shadow-2xl
                        "
                        style={{
                          boxShadow: '8px 8px 24px rgba(0,0,0,0.4), -2px -2px 8px rgba(255,255,255,0.1)',
                        }}
                      >
                        <span className="text-5xl">📖</span>
                      </div>

                      <div className="flex-1 min-w-0 py-2">
                        <span className="inline-flex items-center gap-2 text-orange-400 text-xs font-medium tracking-wider uppercase mb-3">
                          <span className="w-8 h-[1px] bg-orange-400/50" />
                          In Progress
                        </span>
                        <h3 className="text-3xl font-display mb-3 leading-tight group-hover:text-orange-300 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-white/50 text-lg mb-4">
                          by {book.author}
                        </p>
                        {book.notes && (
                          <p className="text-white/40 text-sm leading-relaxed max-w-md">
                            {book.notes}
                          </p>
                        )}
                      </div>

                      {/* Arrow indicator */}
                      {book.link && (
                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Wrapper>
                )
              })}
            </div>
          </section>
        )}

        {/* Completed - Editorial List */}
        {completed.length > 0 && (
          <section
            className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                <h2 className="font-display text-3xl">Completed</h2>
              </div>
              <span className="text-sm text-black/30 font-mono">
                {completed.length} books
              </span>
            </div>

            <div className="space-y-0">
              {completed.map((book, index) => {
                const Wrapper = book.link ? 'a' : 'div'
                const wrapperProps = book.link
                  ? { href: book.link, target: '_blank', rel: 'noopener noreferrer' }
                  : {}

                return (
                  <Wrapper
                    key={book.title}
                    {...wrapperProps}
                    className={`
                      group relative flex items-start gap-6 py-8
                      border-b border-black/5 last:border-b-0
                      ${book.link ? 'cursor-pointer' : ''}
                    `}
                  >
                    {/* Large number */}
                    <span
                      className="
                        text-6xl font-display text-black/[0.03]
                        group-hover:text-orange-500/20
                        transition-colors duration-300
                        leading-none shrink-0 w-20
                        select-none
                      "
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={`text-xl font-medium text-black leading-snug ${book.link ? 'group-hover:text-orange-500 transition-colors' : ''}`}>
                            {book.title}
                          </h3>
                          <p className="text-black/50 mt-1">
                            {book.author}
                          </p>
                        </div>
                        {book.rating !== null && book.rating > 0 && (
                          <div className="shrink-0 pt-1">
                            <StarRating rating={book.rating} />
                          </div>
                        )}
                      </div>
                      {book.notes && (
                        <p className="text-sm text-black/40 mt-4 leading-relaxed italic">
                          "{book.notes}"
                        </p>
                      )}
                    </div>

                    {/* Hover line */}
                    <div
                      className="
                        absolute left-0 bottom-0 h-[2px] bg-orange-500
                        w-0 group-hover:w-full
                        transition-all duration-500 ease-out
                      "
                    />
                  </Wrapper>
                )
              })}
            </div>
          </section>
        )}

        {/* Want to Read - Wishlist */}
        {wantToRead.length > 0 && (
          <section
            className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-black/20 rounded-full" />
              <h2 className="font-display text-3xl text-black/50">Up Next</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {wantToRead.map((book, index) => (
                <div
                  key={book.title}
                  className="
                    group relative p-5 rounded-2xl
                    bg-white border border-black/5
                    hover:border-orange-500/30 hover:shadow-lg
                    transition-all duration-300
                    cursor-default
                  "
                >
                  {/* Bookmark ribbon */}
                  <div
                    className="
                      absolute -top-1 right-4 w-6 h-10
                      bg-orange-500
                      opacity-0 group-hover:opacity-100
                      transition-all duration-300
                      transform -translate-y-2 group-hover:translate-y-0
                    "
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                    }}
                  />

                  <span className="text-3xl mb-3 block">📚</span>
                  <p className="font-medium text-black leading-snug">{book.title}</p>
                  <p className="text-sm text-black/40 mt-1">{book.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {books.length === 0 && (
          <section className="max-w-3xl mx-auto px-6">
            <div className="text-center py-24">
              <div className="relative inline-block">
                <span className="text-8xl block mb-6">📚</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                  ?
                </div>
              </div>
              <p className="text-2xl font-display text-black/30 mb-2">The shelf is empty</p>
              <p className="text-black/40">Check back soon for reading recommendations!</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </Layout>
  )
}

export const getStaticProps = async () => {
  // Try Notion first, fallback to JSON
  let books = await getBookshelfItems()

  if (books.length === 0) {
    books = booksData.books as BookItem[]
  }

  return {
    props: {
      books,
    },
    revalidate: 3600,
  }
}
