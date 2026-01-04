import React from 'react'
import { Layout, FloatingNav, BentoGrid, BentoCard, Footer } from '../components'
import workData from '../content/work.json'

interface Project {
  title: string
  description: string
  role: string
  link?: string
  tags: string[]
}

const WorkPage = () => {
  const projects = workData.projects as Project[]

  return (
    <Layout title="Work" description="Projects and work I've been involved in">
      <FloatingNav />

      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className="mb-10 animate-slide-up opacity-0"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <h1 className="font-display text-4xl md:text-5xl text-text mb-4">
              Work
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              A collection of projects I've worked on. Some are professional work,
              others are side projects and experiments.
            </p>
          </div>

          {/* Projects Grid */}
          <BentoGrid className="lg:grid-cols-3">
            {projects.map((project, index) => (
              <BentoCard
                key={project.title}
                size="medium"
                href={project.link}
                external={!!project.link}
                delay={0.15 + index * 0.05}
                className="flex flex-col"
              >
                <div className="flex-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    {project.role}
                  </span>
                  <h2 className="font-display text-xl text-text mt-1 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-background-subtle text-text-muted rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <div className="flex items-center gap-1 mt-4 text-sm text-accent">
                    <span>View project</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                )}
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </main>

      <Footer />
    </Layout>
  )
}

export default WorkPage
