import React from 'react'
import { getAllPosts } from '../../lib/blog'

import { Layout, Header, Subscribe, Footer, BlogpostsList } from '../../components'
import { useOnReady } from '../../hooks'

export interface FrontMatter {
  type: string;
  title: string;
  description: string;
  date: string;
}

export interface Post {
  slug: string;
  content: string;
  frontmatter: FrontMatter;
}

type BlogPostProps =  {
  data: Post[],
}

const BlogPostPage = ({ data }: BlogPostProps) => {
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
    <>
      <Layout>
        <Header />
        <BlogpostsList blogs={blogPosts} />
        <Subscribe />
        <Footer />
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const posts = getAllPosts()

  return {
    props: {
      data: posts,
    },
  }
}

export default BlogPostPage
