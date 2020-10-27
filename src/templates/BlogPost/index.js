/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout, Header, Subscribe, Footer } from '@components'
import { DarkModeProvider } from '../../Context/theme'
import { ContentWrapper, Title, Container } from './styles'
import TwitterCard from '../../images/twitter-card.png'

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const newsletterRef = useRef(null)

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
          <meta name="twitter:image" content={TwitterCard} />
        </Helmet>
        <Header isReady={true} blogPost newsletterRef={newsletterRef} />
        <Container>
          <Title>{post.frontmatter.title}</Title>
          <hr
            style={{
              margin: `40px 0`,
              border: `0.05px solid #1c1c1c10`,
            }}
          />
          <ContentWrapper dangerouslySetInnerHTML={{ __html: post.html }} />
        </Container>
        {post.frontmatter.title !== 'What I’m Doing Now' &&
          post.frontmatter.title !== 'Bookshelf' && (
            <Subscribe newsletterRef={newsletterRef} />
          )}
        <Footer />
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
