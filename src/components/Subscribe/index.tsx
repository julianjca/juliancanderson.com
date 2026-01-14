'use client'

import React from 'react'

type SubscribePageProps = {
  subscribePage?: boolean
}

export const Subscribe = ({ subscribePage = false }: SubscribePageProps) => {
  return (
    <section className="flex justify-center items-center">
      <div
        className={`${
          subscribePage ? 'py-16' : 'py-5'
        } max-w-[90%] md:max-w-[700px] mx-auto w-full`}
      >
        <h2 className="text-2xl font-bold leading-[1.4] w-full">
          You can subscribe for future posts here.
        </h2>
        <p className="text-sm leading-relaxed w-[95%] md:w-[80%] mt-4 text-gray-500 font-sans">
          I won't send you any spam. You can unsubscribe at any time.
        </p>
        {/* https://www.reddit.com/r/Substack/comments/gldo52/has_anyone_created_a_custom_landing_page_for/ */}
        <iframe
          src="https://juliancanderson.substack.com/embed"
          width="320"
          height="80"
          frameBorder="0"
          scrolling="no"
          title="substack"
          className="-ml-5 mt-5"
        />
      </div>
    </section>
  )
}
