import * as React from 'react'

interface Testimonial {
  quote: string
  name: string
  role: string
  company?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="max-w-3xl mx-auto px-6 mb-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
        <h2 className="font-display text-2xl">What People Say</h2>
      </div>

      <div className="grid gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${index}`}
            className="p-6 rounded-2xl bg-white border border-black/5 hover:border-orange-500/20 transition-colors"
          >
            <blockquote className="text-black/70 mb-4 leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-black text-sm">{testimonial.name}</p>
                <p className="text-xs text-black/50">
                  {testimonial.role}
                  {testimonial.company && ` at ${testimonial.company}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
