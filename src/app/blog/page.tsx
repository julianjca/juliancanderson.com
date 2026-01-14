import { FloatingNav, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { BlogList } from './BlogList'

interface Post {
  slug: string
  frontmatter: {
    title: string
    tags?: string[]
    type?: string
  }
}

export const metadata = {
  title: 'Writing',
  description: 'Thoughts on engineering, product, and learning.',
}

export default function BlogPage() {
  const posts = (getAllPosts() as unknown) as Post[]
  const allTags = (getAllTags() as unknown) as string[]

  return (
    <PageLayout>
      <FloatingNav />
      <main className="pt-24 pb-16">
        <section className="px-6 max-w-3xl mx-auto">
          <div
            className="mb-8 animate-slide-up opacity-0"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <h1 className="font-display text-4xl md:text-5xl mb-4">Writing</h1>
            <p className="text-black/60 text-lg">
              Thoughts on engineering, learning, and things I find interesting.
            </p>
          </div>

          <BlogList posts={posts} allTags={allTags} />
        </section>
      </main>
      <Footer />
    </PageLayout>
  )
}
