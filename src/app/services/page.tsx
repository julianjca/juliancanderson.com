import Link from 'next/link'
import { FloatingNav, Footer, Testimonials } from '@/components'
import { PageLayout } from '../components/PageLayout'
import testimonialsData from '@/content/testimonials.json'

export const metadata = {
  title: 'Services',
  description:
    'Services offered by Julian Christian Anderson - Development, Consulting, and Collaboration',
}

const services = [
  {
    title: 'Development',
    description:
      'Full-stack development for web and mobile applications. From MVPs to production-ready products.',
    icon: '💻',
    includes: [
      'React & Next.js applications',
      'Mobile apps (React Native)',
      'API development',
      'Database design',
    ],
  },
  {
    title: 'Consulting',
    description:
      'Strategic technical advice for teams and founders. Architecture reviews, code audits, and technical direction.',
    icon: '🧭',
    includes: [
      'Architecture reviews',
      'Code audits',
      'Technical strategy',
      'Team mentoring',
    ],
  },
  {
    title: 'Collaboration',
    description:
      "Open to interesting projects and partnerships. If you're building something cool, let's talk.",
    icon: '🤝',
    includes: [
      'Side projects',
      'Open source',
      'Technical co-founding',
      'Advisory roles',
    ],
  },
]

export default function ServicesPage() {
  return (
    <PageLayout>
      <FloatingNav />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide text-sm mb-4">
            Work With Me
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Services
          </h1>
          <p className="text-xl text-black/60 leading-relaxed max-w-2xl">
            I help teams and founders build great products. Whether you need
            hands-on development, technical guidance, or a collaborator for
            something new.
          </p>
        </section>

        {/* Services Grid */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="grid gap-6">
            {services.map(service => (
              <div
                key={service.title}
                className="p-6 rounded-2xl bg-white border border-black/5 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{service.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-display text-xl mb-2">
                      {service.title}
                    </h2>
                    <p className="text-black/60 mb-4">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.includes.map(item => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-black/50"
                        >
                          <span className="w-1 h-1 bg-orange-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-2xl">How I Work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery',
                description:
                  'We start with a conversation to understand your goals, constraints, and timeline.',
              },
              {
                step: '02',
                title: 'Proposal',
                description:
                  "I'll put together a clear scope, timeline, and pricing based on what we discussed.",
              },
              {
                step: '03',
                title: 'Build',
                description:
                  'Regular updates, transparent communication, and a focus on shipping quality work.',
              },
            ].map(phase => (
              <div key={phase.step} className="relative">
                <span className="text-5xl font-display text-black/5 absolute -top-2 -left-1">
                  {phase.step}
                </span>
                <div className="pt-8">
                  <h3 className="font-medium mb-2">{phase.title}</h3>
                  <p className="text-sm text-black/50">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <div
          className="animate-slide-up opacity-0"
          style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
        >
          <Testimonials testimonials={testimonialsData.testimonials} />
        </div>

        {/* CTA */}
        <section
          className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 text-center">
            <h2 className="font-display text-2xl mb-3">
              Let's build something great
            </h2>
            <p className="text-black/60 mb-6 max-w-md mx-auto">
              Have a project in mind? I'd love to hear about it. Reach out and
              let's see if we're a good fit.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:hello@juliancanderson.com"
                className="
                  inline-flex items-center gap-2 px-6 py-3
                  bg-orange-500 text-white rounded-full
                  hover:bg-orange-600 transition-colors
                  font-medium text-sm
                "
              >
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
                Get in touch
              </a>
              <Link
                href="/work"
                className="
                  inline-flex items-center gap-2 px-6 py-3
                  border border-black/10 text-black rounded-full
                  hover:border-orange-500 hover:text-orange-500
                  transition-colors font-medium text-sm
                "
              >
                View my work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageLayout>
  )
}
