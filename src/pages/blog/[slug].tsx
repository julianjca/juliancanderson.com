import remark from 'remark'
import html from 'remark-html'
import { getPostBySlug, getAllPosts } from '../../lib/blog'
import { GetStaticProps } from 'next'

import BlogPost from '../../templates/BlogPost'

export default BlogPost

interface Params {
  slug: string;
}

type Context = {
  params: Params,
}

export const getStaticProps = async ({ params }: Context) => {
  const post = getPostBySlug(params.slug)
  const markdown = await remark()
    .use(html)
    .process(post.content || '')
  const content = markdown.toString()

  return {
    props: {
      ...post,
      content,
    },
  }
}

export const getStaticPaths = async () => {
  const posts = getAllPosts()

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
