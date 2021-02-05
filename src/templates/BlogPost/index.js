/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { Helmet } from 'react-helmet'
import { parseISO, format } from 'date-fns'

import { Layout, Header, Subscribe, Footer } from '@components'
import { DarkModeProvider } from '../../Context/theme'
import { ContentWrapper, Title, Container, StyledDate } from './styles'
import TwitterCard from '../../../public/twitter-card.png'

const BlogPostTemplate = ({ frontmatter, content, slug }) => {
  const newsletterRef = useRef(null)

  const date = format(parseISO(frontmatter.date), 'MMMM dd, yyyy')

  const showDate =
    frontmatter.title !==
      `What I’m Doing Now
    ` || frontmatter.title !== 'BookShelf'

  return (
    <DarkModeProvider>
      <Layout>
        <Helmet defaultTitle={frontmatter.title}>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@juliancanderson" />
          <meta name="twitter:title" content={frontmatter.title} />
          <meta name="twitter:description" content={frontmatter.description} />
          <meta name="twitter:image" content={TwitterCard} />
        </Helmet>
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
    </DarkModeProvider>
  )
}

export default BlogPostTemplate
