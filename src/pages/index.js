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
  Blogpost,
} from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const HomePage = ({ data }) => {
  const newsletterRef = useRef(null)
  const portfolioRef = useRef(null)

  const {
    cms: { pageData },
  } = data

  console.log(data)
  const [isReady] = useOnReady()

  return (
    <DarkModeProvider>
      <Layout>
        <Header
          isReady={isReady}
          newsletterRef={newsletterRef}
          portfolioRef={portfolioRef}
        />
        <Hero isReady={isReady} />
        <About />
        <Portfolio
          portfolios={pageData.portfolios}
          portfolioRef={portfolioRef}
        />
        <Blogpost blogs={pageData.blogs} />
        <Subscribe newsletterRef={newsletterRef} />
        <Footer />
      </Layout>
    </DarkModeProvider>
  )
}

HomePage.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      pageData: PropTypes.shape({
        portfolios: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            imageUrl: PropTypes.string,
            link: PropTypes.string,
            description: PropTypes.string,
            stack: PropTypes.string,
          })
        ),
        blogs: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            url: PropTypes.string,
          })
        ),
      }),
    }),
  }),
}

export const query = graphql`
  query {
    cms {
      pageData(where: { id: "ck5js4qwabtxl0869n9un2ksh" }) {
        blogs {
          title
          url
        }
        portfolios {
          title
          link
        }
      }
    }
  }
`

export default HomePage
