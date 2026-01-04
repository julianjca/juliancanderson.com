import React from 'react'

interface SocialLink {
  href: string
  label: string
  icon: React.ReactNode
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/julianjca',
    label: 'GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com/juliancanderson',
    label: 'Twitter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.6.75h2.454l-5.36 6.126L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.554L0 .75h5.063l3.495 4.622L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
  {
    href: 'mailto:hello@juliancanderson.com',
    label: 'Email',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export const HeroCard = () => {
  return (
    <div
      className="
        col-span-1 md:col-span-2 md:row-span-2
        bg-[#0a0a0a]
        text-white
        rounded-3xl
        p-8 md:p-10
        flex flex-col justify-between
        min-h-[360px] md:min-h-[440px]
        relative
        overflow-hidden
        animate-slide-up opacity-0
      "
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <p className="text-orange-400 text-sm font-medium tracking-wide mb-4">
          Software Engineer
        </p>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
          Hey, I'm <span className="text-orange-400">Julian</span>
          <span
            className="inline-block ml-2 origin-[70%_70%]"
            style={{ animation: 'wave 2.5s ease-in-out infinite' }}
          >
            👋
          </span>
        </h1>

        <p className="text-lg text-white/70 leading-relaxed max-w-md">
          Building products at{' '}
          <a
            href="https://latecheckout.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 decoration-orange-400/50 hover:decoration-orange-400 transition-colors"
          >
            Late Checkout
          </a>
          . I write about engineering, learning, and things I find interesting.
        </p>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {socialLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              bg-white/10
              text-white/70
              hover:bg-orange-500
              hover:text-white
              transition-all duration-200
              backdrop-blur-sm
            "
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  )
}
