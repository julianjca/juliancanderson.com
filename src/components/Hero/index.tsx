import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <section className="px-6 pt-16 pb-20 max-w-3xl mx-auto">
      {/* Intro */}
      <div
        className="animate-slide-up opacity-0"
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        <h1 className="font-display text-4xl md:text-5xl text-text leading-tight mb-6 font-semibold tracking-tight">
          Hey, I'm Julian{' '}
          <span className="inline-block animate-[wave_2s_ease-in-out_infinite] origin-[70%_70%]">
            👋
          </span>
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl">
          Software engineer building products at{' '}
          <a
            href="https://latecheckout.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2"
          >
            Late Checkout
          </a>
          . I write about engineering, learning, and things I find interesting.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/about">About me</Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full">
            <a
              href="https://github.com/julianjca"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </Button>

          <Button asChild variant="outline" className="rounded-full">
            <a
              href="https://twitter.com/juliancanderson"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M12.6.75h2.454l-5.36 6.126L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.554L0 .75h5.063l3.495 4.622L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
              </svg>
              Twitter
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
