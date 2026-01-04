import React from 'react'

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-black/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center">
          <p className="text-sm text-black/40">
            © {new Date().getFullYear()} Julian Anderson
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@juliancanderson.com"
              className="text-sm text-black/40 hover:text-orange-500 transition-colors"
            >
              Email
            </a>
            <a
              href="https://twitter.com/juliancanderson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black/40 hover:text-orange-500 transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com/julianjca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black/40 hover:text-orange-500 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
