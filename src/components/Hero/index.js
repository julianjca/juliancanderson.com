/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Left, Subheading } from './styles'
import { FaceIllustration } from '@components'

export const Hero = ({ isReady, aboutRef }) => {
  return (
    <StyledSection>
      <Container>
        <Left isReady={isReady} toRight>
          <Heading>hello! 🤙🏻</Heading>
          <Subheading>
            my name is Julian <br /> a software engineer from Indonesia.
          </Subheading>
        </Left>
        <FaceIllustration />
      </Container>
    </StyledSection>
  )
}

Hero.propTypes = {
  isReady: PropTypes.bool.isRequired,
  aboutRef: PropTypes.object,
}
