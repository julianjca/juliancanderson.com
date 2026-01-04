import React from 'react'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export const BentoGrid = ({ children, className = '' }: BentoGridProps) => {
  return (
    <div
      className={`
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-4
        lg:gap-5
        max-w-6xl
        mx-auto
        ${className}
      `}
    >
      {children}
    </div>
  )
}
