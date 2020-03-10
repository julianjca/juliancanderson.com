/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { setConfig } from 'react-hot-loader'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import {
  Layout,
  Header,
  Hero,
  Subscribe,
  Footer,
  BlogpostsList,
} from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const HomePage = ({ data }) => {
  const newsletterRef = useRef(null)
  const portfolioRef = useRef(null)

  const blogPosts = data.allMarkdownRemark.edges.map(post => {
    const title = post.node.frontmatter.title
    const description = post.node.excerpt
    const url = post.node.fields.slug

    return {
      title,
      url,
      description,
    }
  })

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
        <BlogpostsList blogs={blogPosts} smallHeading />
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`

export default HomePage
