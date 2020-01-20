import React from 'react'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Subheading } from './styles'
import { Form } from '@components'

export const Subscribe = ({ subscribePage, newsletterRef }) => {
  return (
    <StyledSection>
      <Container subscribePage={subscribePage} ref={newsletterRef}>
        <Heading>
          Get emails from me about coding, business, books, and self
          development.
        </Heading>
        <Subheading>
          I won't send you any spam. You can unsubscribe at any time.
        </Subheading>
        <Form />
      </Container>
    </StyledSection>
  )
}

Subscribe.propTypes = {
  subscribePage: PropTypes.bool,
  newsletterRef: PropTypes.shape({
    current: PropTypes.any,
  }),
}
