import React, { useRef } from 'react'

import { Layout, Subscribe, Header } from '@components'
import { DarkModeProvider } from '../Context/theme'

import 'react-toggle/style.css'

const SubscribePage = () => {
  const newsletterRef = useRef(null)

  return (
    <DarkModeProvider>
      <Layout>
        <Header />
        <Subscribe subscribePage newsletterRef={newsletterRef} />
      </Layout>
    </DarkModeProvider>
  )
}

export default SubscribePage
