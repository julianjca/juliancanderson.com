/* eslint-disable react/prop-types */
import React from 'react'

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

import { getAllPosts } from '../lib/blog'

const HomePage = ({ data }) => {
  // filter /now and /bookshelf
  const blogPosts = data
    .filter(
      post =>
        post.slug !== 'now' &&
        post.slug !== 'bookshelf' &&
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

  const quantifiedProject = data
    .filter(post => post.frontmatter.type === 'quantified-project')
    .map(post => {
      const title = post.frontmatter.title
      const url = post.slug

      return {
        title,
        url,
      }
    })

  return (
    <DarkModeProvider>
      <Layout>
        <Header />
        <Hero />
        <BlogpostsList title="writing" blogs={blogPosts} smallHeading />
        <BlogpostsList
          title="quantified project"
          blogs={quantifiedProject}
          smallHeading
        />
        <Subscribe />
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

export default HomePage
