/* eslint-disable react/prop-types */
import React from 'react'
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

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const HomePage = ({ data }) => {
  // filter /now and /bookshelf
  const blogPosts = data.allMarkdownRemark.edges
    .filter(
      post =>
        post.node.fields.slug !== '/now/' &&
        post.node.fields.slug !== '/bookshelf/'
    )
    .map(post => {
      const title = post.node.frontmatter.title
      const description = post.node.excerpt
      const url = post.node.fields.slug

      return {
        title,
        url,
        description,
      }
    })

  return (
    <DarkModeProvider>
      <Layout>
        <Header />
        <Hero />
        <BlogpostsList blogs={blogPosts} smallHeading />
        <Subscribe />
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
