import * as React from 'react'
import Head from 'next/head'

type LayoutProps = {
  children: React.ReactNode
  title?: string
  description?: string
}

export const Layout = ({ children, title, description }: LayoutProps) => {
  const pageTitle = title
    ? `${title} — Julian Christian Anderson`
    : 'Julian Christian Anderson'
  const pageDescription =
    description ||
    'Software engineer, writer, and learner. Building things on the internet.'

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="description" content={pageDescription} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@juliancanderson" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/og-image.png" />

        <meta
          name="keywords"
          content="julian christian anderson, software engineer, frontend developer, writer, indonesia"
        />
        <meta name="author" content="Julian Christian Anderson" />

        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <title>{pageTitle}</title>

        <meta name="theme-color" content="#0a0a0a" />
      </Head>

      <div className="min-h-screen bg-background text-text">{children}</div>
    </>
  )
}
