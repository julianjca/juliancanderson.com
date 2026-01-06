import matter from 'gray-matter'
// import { parseISO, format } from 'date-fns'
import fs from 'fs'
import { join } from 'path'

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'content', 'blog')

export const getPostBySlug = slug => {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, realSlug)
  const fileContents = fs.readFileSync(`${fullPath}/index.md`, 'utf8')
  const { data, content } = matter(fileContents)
  // const date = format(parseISO(data.date), 'MMMM dd, yyyy')

  return { slug: realSlug, frontmatter: { ...data }, content }
}

export const getAllPosts = () => {
  const slugs = fs.readdirSync(postsDirectory)
  const posts = slugs.map(slug => getPostBySlug(slug))

  posts.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  )

  return posts
}

// Lightweight version - only metadata, no content
export const getAllPostsMeta = () => {
  const slugs = fs.readdirSync(postsDirectory)
  const posts = slugs.map(slug => {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = join(postsDirectory, realSlug)
    const fileContents = fs.readFileSync(`${fullPath}/index.md`, 'utf8')
    const { data } = matter(fileContents)
    return { slug: realSlug, frontmatter: { ...data } }
  })

  posts.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  )

  return posts
}

// Get posts marked as featured
export const getFeaturedPosts = () => {
  const allPosts = getAllPostsMeta()
  return allPosts.filter(post => post.frontmatter.featured === true)
}

// Get all unique tags from posts
export const getAllTags = () => {
  const allPosts = getAllPostsMeta()
  const tagSet = new Set()

  allPosts.forEach(post => {
    const tags = post.frontmatter.tags || []
    tags.forEach(tag => tagSet.add(tag))
  })

  return Array.from(tagSet).sort()
}

// Get posts by tag
export const getPostsByTag = tag => {
  const allPosts = getAllPostsMeta()
  return allPosts.filter(post => {
    const tags = post.frontmatter.tags || []
    return tags.includes(tag)
  })
}
