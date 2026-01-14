import Link from 'next/link'

import { FloatingNav, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'

export const metadata = {
  title: 'About',
  description: 'About Julian Christian Anderson',
}

const pastWorks = [
  {
    name: 'Crypto College',
    url: 'https://cryptocollege.latecheckout.studio',
  },
  {
    name: 'Creatives Club',
    url: 'https://creatives.club',
  },
  {
    name: 'Thirty Days of Lunch',
    url: 'https://thirtydaysoflunch.com',
  },
  {
    name: 'Jumpcut',
    url: 'https://jumpcut.com',
  },
  {
    name: 'Jumpcut Art of The Startup',
    url: 'https://hawaii.jumpcut.com/aots/sales',
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
              I am an{' '}
              <strong className="text-black">
                Industrial Engineering Graduate
              </strong>{' '}
              that turned into a{' '}
              <strong className="text-black">Software Engineer</strong>. I
              rediscover my passion in tech in my last year of college and I
              went through an autodidact path when I first started. I mostly
              learned from articles and online courses.
            </p>

            <p>
              After a couple of months learning by myself I decided to enter a{' '}
              <strong className="text-black">Coding Bootcamp</strong> called{' '}
              <a
                href="https://hacktiv8.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Hacktiv8
              </a>
              .
            </p>

            <p>
              I am currently working at{' '}
              <a
                href="https://latecheckout.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                Late Checkout
              </a>{' '}
              as a Software Engineer (Front End, Backend, and Web3). In 2021 I
              built a full stack web3 site called Crypto College. I wrote the
              Front End Code + the Smart Contract.
            </p>

            <p>
              Beside coding I also love doing some{' '}
              <a
                href="https://unsplash.com/@juliancanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                photography
              </a>{' '}
              and writing. I love to write because it helps me to learn better
              and it can also help people who will learn the same thing through
              my{' '}
              <a
                href="https://dev.to/juliancanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                articles
              </a>
              . I write{' '}
              <Link
                href="/blog"
                className="text-orange-500 border-b-2 border-orange-300 hover:border-orange-500 transition-colors pb-0.5 font-medium"
              >
                about things that I'm interested in
              </Link>{' '}
              too!
            </p>
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
            {pastWorks.map((work, index) => (
              <a
                key={work.name}
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-4 transition-all duration-200"
              >
                <span className="text-black/20 text-sm font-mono w-6 shrink-0 group-hover:text-orange-500 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-black group-hover:text-orange-500 transition-colors flex-1">
                  {work.name}
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
                  className="shrink-0 text-black/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all duration-200"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section
          className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <h2 className="font-display text-3xl">Stay Updated</h2>
          </div>

          <p className="text-black/60 text-lg mb-6 max-w-xl">
            Subscribe for future posts. I won't send you any spam. You can
            unsubscribe at any time.
          </p>

          <iframe
            src="https://juliancanderson.substack.com/embed"
            width="320"
            height="80"
            frameBorder="0"
            scrolling="no"
            title="substack"
            className="opacity-80"
          />
        </section>
      </main>
      <Footer />
    </PageLayout>
  )
}
