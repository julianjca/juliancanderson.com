import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper, Heading, List, Card, Link } from './styles'

export const Links = ({ links }) => {
  return (
    <Wrapper>
      <Heading>Links</Heading>
      <List>
        {links.map(link => (
          <Card key={link.text} href={link.url} target="_blank">
            <Link>{link.text}</Link>
          </Card>
        ))}
      </List>
    </Wrapper>
  )
}

Links.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      text: PropTypes.string,
    })
  ),
}
