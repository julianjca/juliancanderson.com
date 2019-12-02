import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { useTheme } from '../../Context/theme'

import { GlobalStyle, lightTheme, darkTheme } from './styles'

export const Layout = ({ children, isLightTheme }) => {
  const { dark: isDark } = useTheme()
  const Theme = !isDark ? lightTheme : darkTheme

  return (
    <ThemeProvider theme={Theme}>
      <Helmet defer={false} defaultTitle="Julian Christian Anderson">
        <html lang="en" />
        <meta name="docsearch:version" content="2.0" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
        />
      </Helmet>
      <GlobalStyle />
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
