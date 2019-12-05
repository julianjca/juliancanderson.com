import React from 'react'
import { setConfig } from 'react-hot-loader'
import { graphql } from 'gatsby'

import { Layout, Header, Hero, About, Portfolio } from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

export default ({ data }) => {
  const {
    cms: { portfolios },
  } = data
  const [isReady] = useOnReady()
  return (
    <DarkModeProvider>
      <Layout>
        <Header isReady={isReady} />
        <Hero isReady={isReady} />
        <About />
        <Portfolio portfolios={portfolios} />
      </Layout>
    </DarkModeProvider>
  )
}

export const query = graphql`
  query {
    cms {
      portfolios {
        title
        description
        imageUrl
        link
        stack
      }
    }
  }
`
