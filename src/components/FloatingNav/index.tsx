import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Writing' },
  { href: '/bookshelf', label: 'Bookshelf' },
  { href: '/stack', label: 'Stack' },
  { href: '/uses', label: 'Uses' },
]

export const FloatingNav = () => {
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(href)
  }

  return (
    <nav
      className="
        fixed
        top-6
        left-1/2
        -translate-x-1/2
        z-50
        animate-float-in
        opacity-0
      "
      style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
    >
      <div
        className="
          flex
          items-center
          gap-1
          bg-white
          rounded-full
          px-2
          py-2
          shadow-lg
          shadow-black/5
          border
          border-black/5
        "
      >
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative
              px-4
              py-2
              text-sm
              font-medium
              rounded-full
              transition-all
              duration-200
              flex
              items-center
              gap-2
              ${
                isActive(item.href)
                  ? 'bg-orange-500 text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
