import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { Global, css } from '@emotion/core'

// eslint-disable-next-line no-warning-comments
//TODO revisit dark theme
// import { useTheme } from '../../Context/theme'

// import { GlobalStyle, lightTheme, darkTheme } from './styles'
import { GlobalStyle, lightTheme } from './styles'

export const Layout = ({ children }) => {
  // const { dark: isDark } = useTheme()
  // const Theme = !isDark ? lightTheme : darkTheme
  const Theme = lightTheme

  return (
    <ThemeProvider theme={Theme}>
      <Helmet defer={false} defaultTitle="Julian Christian Anderson">
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
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dpqchalu9/image/upload/v1579490419/personal-web/twitter-card_dnvixf.png"
        />
        <meta
          name="keywords"
          content="frontend engineer, frontend developer, julian, julian christian anderson, juliancanderson, personal website, javascript developer, software engineer, web developer"
        />
        <meta name="author" content="Julian Christian Anderson" />
        <meta name="copyright" content="Julian Christian Anderson" />
        {process.env.NODE_ENV !== 'development' && (
          <>
            <async src="https://www.googletagmanager.com/gtag/js?id=UA-168727222-1" />
            <script>
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-168727222-1');
            `}
            </script>
          </>
        )}
      </Helmet>
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

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isLightTheme: PropTypes.bool,
}

Layout.defaultProps = {
  isLightTheme: true,
}
