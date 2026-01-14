import { FloatingNav, BentoGrid, BentoCard, Footer } from '@/components'
import { PageLayout } from '../components/PageLayout'
import workData from '@/content/work.json'

export const metadata = {
  title: 'Work',
  description: "Projects and work I've been involved in",
}

interface CaseStudy {
  problem: string
  approach: string
  outcome: string
}

interface Project {
  title: string
  description: string
  role: string
  link?: string
  tags: string[]
  featured?: boolean
  caseStudy?: CaseStudy
}

export default function WorkPage() {
  const projects = workData.projects as Project[]
  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <PageLayout>
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
              A collection of projects I've worked on. Some are professional
              work, others are side projects and experiments.
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2
                className="font-display text-2xl mb-6 animate-slide-up opacity-0"
                style={{
                  animationDelay: '0.15s',
                  animationFillMode: 'forwards',
                }}
              >
                Featured
              </h2>
              {featuredProjects.map((project, index) => (
                <div
                  key={project.title}
                  className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${0.2 + index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <span className="text-xs text-orange-600 uppercase tracking-wider font-medium">
                        {project.role}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl mt-1 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-black/60 mb-4">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs bg-white/80 text-black/60 rounded-full border border-orange-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {project.caseStudy && (
                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-orange-200/50">
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-orange-600 font-medium mb-2">
                              Challenge
                            </h4>
                            <p className="text-sm text-black/60">
                              {project.caseStudy.problem}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-orange-600 font-medium mb-2">
                              Approach
                            </h4>
                            <p className="text-sm text-black/60">
                              {project.caseStudy.approach}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-orange-600 font-medium mb-2">
                              Outcome
                            </h4>
                            <p className="text-sm text-black/60">
                              {project.caseStudy.outcome}
                            </p>
                          </div>
                        </div>
                      )}

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-6 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          View project
                          <svg
                            width="16"
                            height="16"
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
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Projects Grid */}
          {otherProjects.length > 0 && (
            <>
              <h2
                className="font-display text-2xl mb-6 animate-slide-up opacity-0"
                style={{
                  animationDelay: `${0.3 + featuredProjects.length * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                Other Projects
              </h2>
              <BentoGrid className="lg:grid-cols-3">
                {otherProjects.map((project, index) => (
                  <BentoCard
                    key={project.title}
                    size="medium"
                    href={project.link}
                    external={!!project.link}
                    delay={0.35 + featuredProjects.length * 0.1 + index * 0.05}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </PageLayout>
  )
}
