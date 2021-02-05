/* eslint-disable react/prop-types */
import React, { useRef } from 'react'
import { getAllPosts } from '../lib/blog'

import { Layout, Header, Subscribe, Footer, BlogpostsList } from '@components'
import { DarkModeProvider } from '../../Context/theme'
import { useOnReady } from '@hooks'

const BlogPostPage = ({ data }) => {
  const newsletterRef = useRef(null)

  // filter /now and /bookshelf
  const blogPosts = data
    .filter(
      post =>
        post.slug !== '/now/' &&
        post.slug !== '/bookshelf/' &&
        post.frontmatter.type !== 'quantified-project'
    )
    .map(post => {
      const title = post.frontmatter.title
      const url = post.slug

      return {
        title,
        url,
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

export const getStaticProps = async ({ params }) => {
  const posts = getAllPosts()

  return {
    props: {
      data: posts,
    },
  }
}

export default BlogPostPage
