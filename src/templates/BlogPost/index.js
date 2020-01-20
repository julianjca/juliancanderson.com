import React, { useRef } from 'react'
import { Link, graphql } from 'gatsby'

import { Layout, Header, Subscribe, Footer } from '@components'
import { DarkModeProvider } from '../../Context/theme'
import { ContentWrapper, Title, Container } from './styles'

const BlogPostTemplate = props => {
  const post = props.data.markdownRemark
  const newsletterRef = useRef(null)
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next } = props.pageContext

  return (
    <DarkModeProvider>
      <Layout>
        <Container>
          <Header isReady={true} blogPost newsletterRef={newsletterRef} />
          <Title>{post.frontmatter.title}</Title>
          <ContentWrapper dangerouslySetInnerHTML={{ __html: post.html }} />
          <Subscribe newsletterRef={newsletterRef} />
          <Footer />
        </Container>
      </Layout>
    </DarkModeProvider>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
