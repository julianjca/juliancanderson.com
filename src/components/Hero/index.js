/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import {
  StyledSection,
  Container,
  Heading,
  Left,
  Subheading,
  Image,
} from './styles'

import hero from '../../images/hero.jpg'

export const Hero = () => {
  return (
    <StyledSection>
      <Container>
        <Left>
          <Heading>Hi! 🤙🏻</Heading>
          <Subheading>
            My name is Julian. <br /> A Software Engineer based in Jakarta,
            Indonesia.
          </Subheading>
        </Left>
        <Image src={hero} alt="hero" />
      </Container>
    </StyledSection>
  )
}
