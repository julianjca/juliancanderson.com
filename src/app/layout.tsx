import { Sora, Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import '../styles/globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Julian Christian Anderson',
    template: '%s - Julian Christian Anderson',
  },
  description:
    'Software engineer, writer, and learner. Building things on the internet.',
  keywords: [
    'julian christian anderson',
    'software engineer',
    'frontend developer',
    'writer',
    'indonesia',
  ],
  authors: [{ name: 'Julian Christian Anderson' }],
  creator: 'Julian Christian Anderson',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://juliancanderson.com',
    siteName: 'Julian Christian Anderson',
    title: 'Julian Christian Anderson',
    description:
      'Software engineer, writer, and learner. Building things on the internet.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@juliancanderson',
    creator: '@juliancanderson',
    title: 'Julian Christian Anderson',
    description:
      'Software engineer, writer, and learner. Building things on the internet.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
  metadataBase: new URL('https://juliancanderson.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-sans/style.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-mono/style.min.css"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body
        className={`${sora.variable} ${geist.variable} ${geistMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
