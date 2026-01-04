import * as React from 'react'

import { Layout, FloatingNav, About, Subscribe, Footer } from '../components'

const AboutPage = () => {
  return (
    <Layout title="About" description="About Julian Christian Anderson">
      <FloatingNav />
      <main className="pt-24 pb-16">
        <About />
        <Subscribe />
      </main>
      <Footer />
    </Layout>
  )
}

export default AboutPage
