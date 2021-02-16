// Install remark and remark-html
import remark from 'remark'
import html from 'remark-html'
import { getPostBySlug } from '../lib/blog'

import BlogPost from '../templates/BlogPost'

export default BlogPost

export const getStaticProps = async () => {
  const post = getPostBySlug('bookshelf')
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
