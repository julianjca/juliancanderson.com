import React from 'react'
import { setConfig } from 'react-hot-loader'

import { Layout, Form } from '@components'
import { DarkModeProvider } from '../Context/theme'

import 'react-toggle/style.css'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const SubscribePage = () => {
  return (
    <DarkModeProvider>
      <Layout>
        <Form subscribePage />
      </Layout>
    </DarkModeProvider>
  )
}

export default SubscribePage
