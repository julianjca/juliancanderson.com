/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout, Header, Subscribe, Footer } from '@components'
import { DarkModeProvider } from '../../Context/theme'
import { ContentWrapper, Title, Container } from './styles'

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const newsletterRef = useRef(null)
  console.log(post)

  return (
    <DarkModeProvider>
      <Layout>
        <Helmet defaultTitle={post.frontmatter.title}>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@juliancanderson" />
          <meta name="twitter:title" content={post.frontmatter.title} />
          <meta
            name="twitter:description"
            content={post.frontmatter.description}
          />
          <meta
            name="twitter:image"
            content="https://res.cloudinary.com/dpqchalu9/image/upload/v1579490419/personal-web/twitter-card_dnvixf.png"
          />
        </Helmet>
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
