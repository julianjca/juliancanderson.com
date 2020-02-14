import React from 'react'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Subheading } from './styles'
import { Form } from '@components'

export const Subscribe = ({ subscribePage, newsletterRef }) => {
  return (
    <StyledSection>
      <Container subscribePage={subscribePage} ref={newsletterRef}>
        <Heading>
          I have a weekly newsletter called A Percent Better. I think you might
          enjoy it.
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
