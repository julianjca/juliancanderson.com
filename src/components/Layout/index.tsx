import * as React from 'react'
import { ThemeProvider } from '@emotion/react'
import Head from 'next/head'
import { Global, css } from '@emotion/react'

import { GlobalStyle, lightTheme } from './styles'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout  = ({ children }: LayoutProps) => {
  // const { dark: isDark } = useTheme()
  // const Theme = !isDark ? lightTheme : darkTheme
  const Theme = lightTheme

  return (
    <ThemeProvider theme={Theme}>
      <Head>
        <html lang="en" />
        <meta name="docsearch:version" content="2.0" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
        />
        <meta
          name="description"
          content="My name is Julian Christian Anderson. Professional Software Engineer that focus 
                    on delivering the best web application. This is my personal site and you can see my portfolio here"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@juliancanderson" />
        <meta name="twitter:title" content="Julian Christian Anderson" />
        <meta
          name="twitter:description"
          content="Software Engineer from Indonesia"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dpqchalu9/image/upload/v1602160181/personal-web/twitter-card_z2eqxv.png"
        />
        <meta
          name="keywords"
          content="frontend engineer, frontend developer, julian, julian christian anderson, juliancanderson, personal website, javascript developer, software engineer, web developer"
        />
        <meta name="author" content="Julian Christian Anderson" />
        <meta name="copyright" content="Julian Christian Anderson" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <title>Julian Christian Anderson</title>
      </Head>
      {/* <GlobalStyle /> */}
      <Global styles={GlobalStyle} />
      <Global
        styles={css`
          html,
          body {
            color: ${Theme.colors.primary};
            background: ${Theme.colors.background};
          }
        `}
      />
      {children}
    </ThemeProvider>
  )
}