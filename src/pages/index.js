import React from 'react'
import { setConfig } from 'react-hot-loader'
import { Layout, Header, Hero, About } from '@components'
import { DarkModeProvider } from '../Context/theme'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const IndexPage = () => {
  return (
    <DarkModeProvider>
      <Layout>
        <Header />
        <Hero />
        <About />
      </Layout>
    </DarkModeProvider>
  )
}

export default IndexPage
