import React, { useRef } from 'react'
import { setConfig } from 'react-hot-loader'

import { Layout, Subscribe, Header } from '@components'
import { DarkModeProvider } from '../Context/theme'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

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
