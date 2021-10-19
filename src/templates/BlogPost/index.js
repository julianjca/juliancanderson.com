/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import Head from 'next/head'
import { parseISO, format } from 'date-fns'

import { Layout, Header, Subscribe, Footer } from '@components'
import { ContentWrapper, Title, Container, StyledDate } from './styles'
import TwitterCard from '../../../public/twitter-card.png'

const BlogPostTemplate = ({ frontmatter, content, slug }) => {
  const newsletterRef = useRef(null)

  const date = format(parseISO(frontmatter.date), 'MMMM dd, yyyy')

  const showDate = frontmatter.type !== `permanent`

  return (
    <>
      <Layout>
        <Head>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@juliancanderson" />
          <meta name="twitter:title" content={frontmatter.title} />
          <meta name="twitter:description" content={frontmatter.description} />
          <meta name="twitter:image" content={TwitterCard} />
          <title>{frontmatter.title}</title>
        </Head>
        <Header isReady={true} blogPost newsletterRef={newsletterRef} />
        <Container>
          <Title>{frontmatter.title}</Title>
          {showDate && <StyledDate>{date}</StyledDate>}
          {/* <hr
            style={{
              margin: `40px 0`,
              border: `0.05px solid #1c1c1c10`,
            }}
          /> */}
          <ContentWrapper dangerouslySetInnerHTML={{ __html: content }} />
        </Container>
        {frontmatter.title !== 'What I’m Doing Now' &&
          frontmatter.title !== 'Bookshelf' && (
            <Subscribe newsletterRef={newsletterRef} />
          )}
        <Footer />
      </Layout>
    </>
  )
}

export default BlogPostTemplate
