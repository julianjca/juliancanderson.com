import Link from 'next/link'

import { FloatingNav, Footer, SubstackEmbed } from '@/components'
import { PageLayout } from '../components/PageLayout'

export const metadata = {
  title: 'About',
  description: 'About Julian Christian Anderson',
}

const pastWorks: { name: string; url?: string }[] = [
  {
    name: 'Late Checkout Studio',
    url: 'https://latecheckout.studio',
  },
  {
    name: 'Late Checkout Agency',
    url: 'https://latecheckout.agency',
  },
  {
    name: 'Crypto College',
    url: 'https://cryptocollege.latecheckout.studio',
  },
  {
    name: 'Creatives Club',
  },
  {
    name: 'Thirty Days of Lunch',
  },
  {
    name: 'Jumpcut',
  },
  {
    name: 'Jumpcut Art of The Startup',
  },
  {
    name: 'Blibli.com',
    url: 'https://blibli.com',
  },
]

export default function AboutPage() {
  return (
    <PageLayout>
      <FloatingNav />
      <main className="pt-28 pb-24">
        {/* Hero Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="text-orange-500 font-medium tracking-wide text-sm mb-4">
            About Me
          </p>

          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-8">
            Hey, I'm Julian
          </h1>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed">
            <p>
              I'm a self-taught developer who fell in love with{' '}
              <strong className="text-black">
                building things for the web
              </strong>
              .
            </p>

            <p>
              My path wasn't traditional—I studied Industrial Engineering, but
              rediscovered my passion for tech in my final year of college. I
              taught myself through articles and online courses, then leveled up
              at{' '}
              <a
                href="https://hacktiv8.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Hacktiv8
              </a>
              , a coding bootcamp.
            </p>

            <p>
              Now I'm a{' '}
              <strong className="text-black">Full Stack Engineer</strong> at{' '}
              <a
                href="https://latecheckout.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Late Checkout
              </a>
              , where I build everything from frontend interfaces to backend
              systems to smart contracts. I shipped Crypto College in 2021—wrote
              the frontend and the Solidity contracts myself.
            </p>

            <p>
              When I'm not coding, you'll find me taking{' '}
              <a
                href="https://unsplash.com/@juliancanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                photos
              </a>
              ,{' '}
              <Link
                href="/blog"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                writing
              </Link>{' '}
              about what I'm learning, or diving deep into whatever rabbit hole
              has my attention.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="h-px bg-black/10" />
        </div>

        {/* Beyond Code Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-16 animate-slide-up opacity-0"
          style={{ animationDelay: '0.18s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Beyond Code</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="https://unsplash.com/@juliancanderson"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 -m-4 rounded-xl hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">📷</span>
                <h3 className="font-medium text-black group-hover:text-orange-500 transition-colors">
                  Photography
                </h3>
              </div>
              <p className="text-black/60 text-sm leading-relaxed">
                I shoot street and travel photography. My photos have been
                downloaded millions of times on Unsplash.
              </p>
            </a>
            <Link
              href="/blog"
              className="group p-4 -m-4 rounded-xl hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">✍️</span>
                <h3 className="font-medium text-black group-hover:text-orange-500 transition-colors">
                  Writing
                </h3>
              </div>
              <p className="text-black/60 text-sm leading-relaxed">
                Writing helps me think. I share what I learn about tech, life,
                and everything in between.
              </p>
            </Link>
            <div className="p-4 -m-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🐰</span>
                <h3 className="font-medium text-black">Rabbit Holes</h3>
              </div>
              <p className="text-black/60 text-sm leading-relaxed">
                Always learning something new. Right now I'm exploring AI
                tooling and how it's changing the way we build software.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="h-px bg-black/10" />
        </div>

        {/* Past Works Section */}
        <section
          className="max-w-3xl mx-auto px-6 mb-20 animate-slide-up opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Past & Present Works</h2>
          </div>

          <div className="space-y-0 divide-y divide-black/5">
            {pastWorks.map((work, index) => {
              const Wrapper = work.url ? 'a' : 'div'
              const wrapperProps = work.url
                ? {
                    href: work.url,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : {}

              return (
                <Wrapper
                  key={work.name}
                  {...wrapperProps}
                  className={`flex items-center gap-4 py-4 transition-all duration-200 ${
                    work.url ? 'group cursor-pointer' : ''
                  }`}
                >
                  <span
                    className={`text-sm font-mono w-6 shrink-0 transition-colors ${
                      work.url
                        ? 'text-black/20 group-hover:text-orange-500'
                        : 'text-black/20'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`flex-1 transition-colors ${
                      work.url
                        ? 'text-black group-hover:text-orange-500'
                        : 'text-black/50'
                    }`}
                  >
                    {work.name}
                  </span>
                  {work.url && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-black/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all duration-200"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  )}
                </Wrapper>
              )
            })}
          </div>
        </section>

        {/* Substack Subscribe Section */}
        <SubstackEmbed />
      </main>
      <Footer />
    </PageLayout>
  )
}
