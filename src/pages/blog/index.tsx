import React from 'react'
import { getAllPosts } from '../../lib/blog'

import { Layout, FloatingNav, Footer, BlogpostsList } from '../../components'

export interface FrontMatter {
  type: string
  title: string
  description: string
  date: string
}

export interface Post {
  slug: string
  content: string
  frontmatter: FrontMatter
}

type BlogPostProps = {
  data: Post[]
}

const BlogPostPage = ({ data }: BlogPostProps) => {
  const blogPosts = data
    .filter(
      post =>
        post.slug !== '/now/' &&
        post.slug !== '/bookshelf/' &&
        post.frontmatter.type !== 'quantified-project' &&
        post.frontmatter.type !== 'permanent'
    )
    .map(post => ({
      title: post.frontmatter.title,
      url: post.slug,
    }))

  return (
    <Layout title="Writing" description="Thoughts on engineering, product, and learning.">
      <FloatingNav />
      <main className="pt-24 pb-16">
        <BlogpostsList blogs={blogPosts} showViewAll={false} />
      </main>
      <Footer />
    </Layout>
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
