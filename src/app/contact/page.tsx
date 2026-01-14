import { FloatingNav, BentoCard, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with me',
}

const contactLinks = [
  {
    label: 'Email',
    value: 'hello@juliancanderson.com',
    href: 'mailto:hello@juliancanderson.com',
    icon: (
      <svg
        width="24"
        height="24"
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
  {
    label: 'Twitter',
    value: '@juliancanderson',
    href: 'https://twitter.com/juliancanderson',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.6.75h2.454l-5.36 6.126L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.554L0 .75h5.063l3.495 4.622L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'julianjca',
    href: 'https://github.com/julianjca',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'Julian Anderson',
    href: 'https://linkedin.com/in/juliancanderson',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div
            className="mb-10 animate-slide-up opacity-0"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <h1 className="font-display text-4xl md:text-5xl text-text mb-4">
              Get in touch
            </h1>
            <p className="text-lg text-text-secondary">
              I'm always open to interesting conversations and opportunities.
              Feel free to reach out through any of these channels.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactLinks.map((contact, index) => (
              <BentoCard
                key={contact.label}
                href={contact.href}
                external
                delay={0.15 + index * 0.05}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-text-muted group-hover:text-accent transition-colors">
                    {contact.icon}
                  </div>
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                      {contact.label}
                    </span>
                    <p className="text-text group-hover:text-accent transition-colors mt-0.5">
                      {contact.value}
                    </p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </PageLayout>
  )
}
