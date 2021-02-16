import * as React from 'react'

import { Layout, Header, About, Subscribe, Footer } from '../components'

const HomePage = () => {
  return (
    <>
      <Layout>
        <Header />
        <About />
        <Subscribe />
        <Footer />
      </Layout>
    </>
  )
}

export default HomePage
