import React from 'react'

import { Layout, Links } from '@components'

const defaultLinks = [
  {
    text: 'Personal Website',
    url: 'https://juliancanderson.com',
  },
  {
    text: 'Blog',
    url: 'https://juliancanderson.com/blog',
  },
  {
    text: 'Newsletter',
    url: 'https://juliancanderson.com/subscribe',
  },
  {
    text: 'Practical Dev',
    url: 'https://dev.to/juliancanderson',
  },
  {
    text: 'Book Club',
    url: 'https://discord.gg/kkXygrs',
  },
]

const LinksPage = () => {
  const links = defaultLinks
  return (
    <Layout isLightTheme>
      <Links links={links} />
    </Layout>
  )
}

export default LinksPage
