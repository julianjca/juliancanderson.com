'use client'

export const SubstackEmbed = () => {
  return (
    <section
      className="max-w-3xl mx-auto px-6 animate-slide-up opacity-0"
      style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
        <h2 className="font-display text-3xl">Subscribe</h2>
      </div>

      <p className="text-black/60 text-lg mb-6 max-w-xl">
        Get notified when I publish new posts. No spam, unsubscribe anytime.
      </p>

      <div className="rounded-2xl overflow-hidden border border-orange-500 bg-white inline-block">
        <iframe
          src="https://juliancanderson.substack.com/embed"
          width="480"
          height="150"
          frameBorder="0"
          scrolling="no"
          title="Subscribe to Julian's newsletter"
          className="block"
        />
      </div>
    </section>
  )
}
