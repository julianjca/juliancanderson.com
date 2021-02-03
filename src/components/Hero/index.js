/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { StyledSection, Container, Heading, Left, Subheading } from './styles'
// import { FaceIllustration } from '@components'

export const Hero = ({ isReady, aboutRef }) => {
  return (
    <StyledSection>
      <Container>
        <Left isReady={isReady} toRight>
          <Heading>hello!</Heading>
          <Subheading>
            my name is Julian, <br /> a software engineer. <br /> a writer.{' '}
            <br /> a reader. <br /> a learner.
          </Subheading>
          <Link
            style={{
              marginTop: '15px',
              display: 'block',
              textDecoration: 'none',
              color: '#2ED1A2',
              fontWeight: '600',
            }}
            to="/about"
          >
            more about me
          </Link>
        </Left>
        {/* <FaceIllustration /> */}
      </Container>
    </StyledSection>
  )
}

Hero.propTypes = {
  isReady: PropTypes.bool,
  aboutRef: PropTypes.object,
}
