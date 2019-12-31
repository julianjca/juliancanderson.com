import React from 'react'
import { setConfig } from 'react-hot-loader'
import { Layout, Links } from '@components'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const links = [
  {
    text: 'Personal Website',
    url: 'https://juliancanderson.com',
  },
  {
    text: 'Blog',
    url: 'https://blog.juliancanderson.com',
  },
  {
    text: 'Newsletter',
    url: 'https://juliancanderson.com/subscribe',
  },
  {
    text: 'Practical Dev',
    url: 'https://dev.to/juliancanderson',
  },
]
const LinksPage = () => {
  return (
    <Layout isLightTheme>
      <Links links={links} />
    </Layout>
  )
}

export default LinksPage
