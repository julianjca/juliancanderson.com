import React from 'react'
import Link from 'next/link'

type CardSize = 'small' | 'medium' | 'large' | 'wide' | 'tall'

interface BentoCardProps {
  children: React.ReactNode
  size?: CardSize
  className?: string
  href?: string
  external?: boolean
  hover?: boolean
  delay?: number
}

const sizeClasses: Record<CardSize, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  large: 'col-span-1 md:col-span-2 md:row-span-2',
  wide: 'col-span-1 md:col-span-2 lg:col-span-4',
  tall: 'col-span-1 row-span-1 md:row-span-2',
}

export const BentoCard = ({
  children,
  size = 'small',
  className = '',
  href,
  external = false,
  hover = true,
  delay = 0,
}: BentoCardProps) => {
  const baseClasses = `
    bg-background-card
    rounded-2xl
    p-6
    shadow-[var(--shadow-card)]
    transition-all
    duration-300
    ease-out
    animate-slide-up
    opacity-0
    ${hover ? 'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1' : ''}
    ${sizeClasses[size]}
    ${className}
  `

  const style = {
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards' as const,
  }

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          style={style}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClasses} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <div className={baseClasses} style={style}>
      {children}
    </div>
  )
}
