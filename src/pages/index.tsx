/* eslint-disable react/prop-types */
import * as React from 'react'

import {
  Layout,
  Header,
  Hero,
  Subscribe,
  Footer,
  BlogpostsList,
} from '../components'

import { getAllPosts } from '../lib/blog'

interface FrontMatter {
  type: string;
  title: string;
  description: string;
  date: string;
}

interface Post {
  slug: string;
  content: string;
  frontmatter: FrontMatter;
}

type HomePageProps =  {
  data: Post[],
}

const HomePage = ({ data }: HomePageProps) => {
  // filter /now and /bookshelf
  const blogPosts = data
    .filter(
      post =>
        post.slug !== 'now' &&
        post.slug !== 'bookshelf' &&
        post.frontmatter.type !== 'quantified-project'
    )
    .map(post => {
      const title: string = post.frontmatter.title
      const url: string = post.slug

      return {
        title,
        url,
      }
    })

  const quantifiedProject = data
    .filter(post => post.frontmatter.type === 'quantified-project')
    .map(post => {
      const title: string = post.frontmatter.title
      const url: string = post.slug

      return {
        title,
        url,
      }
    })

  return (
    <>
      <Layout>
        <Header />
        <Hero />
        <BlogpostsList title="writing" blogs={blogPosts} smallHeading />
        <BlogpostsList
          title="quantified project"
          blogs={quantifiedProject}
          smallHeading
        />
        <Subscribe  />
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

export default HomePage
