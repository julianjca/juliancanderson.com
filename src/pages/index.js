import React, { useRef } from 'react'
import { setConfig } from 'react-hot-loader'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import {
  Layout,
  Header,
  Hero,
  About,
  Portfolio,
  Subscribe,
  Footer,
} from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const HomePage = ({ data }) => {
  const aboutRef = useRef(null)
  const portfolioRef = useRef(null)

  const {
    cms: { portfolios },
  } = data
  const [isReady] = useOnReady()

  return (
    <DarkModeProvider>
      <Layout>
        <Header
          isReady={isReady}
          aboutRef={aboutRef}
          portfolioRef={portfolioRef}
        />
        <Hero isReady={isReady} aboutRef={aboutRef} />
        <About aboutRef={aboutRef} />
        <Portfolio portfolios={portfolios} portfolioRef={portfolioRef} />
        <Subscribe />
        <Footer />
      </Layout>
    </DarkModeProvider>
  )
}

HomePage.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      portfolios: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          imageUrl: PropTypes.string,
          link: PropTypes.string,
          description: PropTypes.string,
          stack: PropTypes.string,
        })
      ),
    }),
  }),
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

export default HomePage
