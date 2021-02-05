/* eslint-disable react/prop-types */
import React, { useRef } from 'react'

import { Layout, Header, About, Subscribe, Footer } from '@components'
import { DarkModeProvider } from '../Context/theme'
import { useOnReady } from '@hooks'

const HomePage = () => {
  const newsletterRef = useRef(null)
  const portfolioRef = useRef(null)
  // const {
  //   cms: { pageData },
  // } = data

  const [isReady] = useOnReady()

  return (
    <DarkModeProvider>
      <Layout>
        <Header
          isReady={isReady}
          newsletterRef={newsletterRef}
          portfolioRef={portfolioRef}
        />
        <About />
        <Subscribe newsletterRef={newsletterRef} />
        <Footer />
      </Layout>
    </DarkModeProvider>
  )
}

export default HomePage
