/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { css, keyframes } from 'styled-components'

import { rem } from '@utils'
import {
  StyledSection,
  Container,
  Heading,
  Left,
  Subheading,
  Image,
  ScrollButton,
} from './styles'

import hero from '../../images/hero_image.jpg'
import { FadeIn } from '@components'
import { scrollToRef } from '@utils'

const FloatingKeyFrames = keyframes`
  0% {
    transform: translateY(-20px);
  }

  50% {
    translateY(-10px);
  }

  100% {
    transform: translateY(0);
  }
`

const flexCSS = css`
  flex: 1 0 100%;
  margin-top: ${rem(60)};
  animation: ${FloatingKeyFrames} 0.75s infinite alternate ease-in-out;
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`

export const Hero = ({ isReady, aboutRef }) => {
  const handleScrollToRef = useCallback(() => scrollToRef(aboutRef), [aboutRef])

  return (
    <StyledSection>
      <Container>
        <Left isReady={isReady} toRight>
          <Heading>Hi! 🤙🏻</Heading>
          <Subheading>
            My name is Julian. <br /> A Software Engineer <br /> from Indonesia.
          </Subheading>
        </Left>
        <Image isReady={isReady} src={hero} alt="hero" toLeft />
        <FadeIn isReady={isReady} toTop cssProps={flexCSS}>
          <ScrollButton onClick={handleScrollToRef} />
        </FadeIn>
      </Container>
    </StyledSection>
  )
}

Hero.propTypes = {
  isReady: PropTypes.bool.isRequired,
  aboutRef: PropTypes.object,
}
