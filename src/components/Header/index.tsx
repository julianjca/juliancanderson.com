'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/now', label: 'Now' },
  { href: '/blog', label: 'Writing' },
  { href: '/bookshelf', label: 'Bookshelf' },
]

export const Header = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border-subtle">
      <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-display text-xl text-text hover:text-accent transition-colors"
        >
          Julian Anderson
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-3 py-1.5 text-sm rounded-full transition-all
                ${
                  pathname === item.href
                    ? 'text-accent font-medium'
                    : 'text-text-secondary hover:text-text'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
