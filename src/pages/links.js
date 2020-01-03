import React from 'react'
import { setConfig } from 'react-hot-loader'
import PropTypes from 'prop-types'

import { Layout, Links } from '@components'
import { graphql } from 'gatsby'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const defaultLinks = [
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
  {
    text: 'Book Club',
    url: 'https://discord.gg/kkXygrs',
  },
]
const LinksPage = ({ data }) => {
  const links = data ? data.cms.links : defaultLinks
  return (
    <Layout isLightTheme>
      <Links links={links} />
    </Layout>
  )
}

LinksPage.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      links: PropTypes.oneOfType([
        PropTypes.shape({
          text: PropTypes.string,
          url: PropTypes.string,
        }),
        PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string,
            url: PropTypes.string,
          })
        ),
      ]),
    }),
  }),
}

export const query = graphql`
  query {
    cms {
      links {
        text
        url
      }
    }
  }
`
export default LinksPage
