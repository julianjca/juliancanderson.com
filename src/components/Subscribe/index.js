import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { css } from '@emotion/core'

import { StyledSection, Container, Heading, Subheading } from './styles'
import { Form } from '@components'

export const Subscribe = ({ subscribePage, newsletterRef }) => {
  return (
    <StyledSection>
      <Container subscribePage={subscribePage} ref={newsletterRef}>
        <Heading>
          I have a weekly newsletter called <br />
          <Link
            css={css`
              text-decoration: none;
              position: relative;
              color: #1c1c1c;
              z-index: 0;
              height: 100%;
              width: 100%;
              background: #2ed1a2;
              padding: 2px 3px;
              border-radius: 3px;
            `}
            to="/blog"
          >
            A Percent Better
          </Link>
          .{' '}
          <br
            css={css`
              @media (min-width: 700px) {
                display: none;
              }
            `}
          />
          I think you might enjoy it.
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
