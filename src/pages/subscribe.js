import React from 'react'
import { setConfig } from 'react-hot-loader'

import { Layout, Substack } from '@components'
import { DarkModeProvider } from '../Context/theme'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const SubscribePage = () => {
  return (
    <DarkModeProvider>
      <Layout>
        <Substack subscribePage />
      </Layout>
    </DarkModeProvider>
  )
}

export default SubscribePage
