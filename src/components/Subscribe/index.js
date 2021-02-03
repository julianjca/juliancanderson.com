import React from 'react'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Subheading } from './styles'

export const Subscribe = ({ subscribePage, newsletterRef }) => {
  return (
    <StyledSection>
      <Container subscribePage={subscribePage} ref={newsletterRef}>
        <Heading>You can subscribe for future posts here.</Heading>
        <Subheading>
          I won't send you any spam. You can unsubscribe at any time.
        </Subheading>
        {/* https://www.reddit.com/r/Substack/comments/gldo52/has_anyone_created_a_custom_landing_page_for/ */}
        <iframe
          src="https://juliancanderson.substack.com/embed"
          width="320"
          height="80"
          frameBorder="0"
          scrolling="no"
          title="substack"
          style={{
            marginLeft: '-20px',
            marginTop: '20px',
          }}
        ></iframe>
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
