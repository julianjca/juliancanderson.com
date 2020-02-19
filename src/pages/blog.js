/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { setConfig } from 'react-hot-loader'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import { Layout, Header, Subscribe, Footer, BlogpostsList } from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const BlogPostPage = ({ data }) => {
  const newsletterRef = useRef(null)

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
          blogPost
          hideMobileHeader
        />
        <BlogpostsList blogs={blogPosts} />
        <Subscribe newsletterRef={newsletterRef} />
        <Footer />
      </Layout>
    </DarkModeProvider>
  )
}

BlogPostPage.propTypes = {
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

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
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

export default BlogPostPage
