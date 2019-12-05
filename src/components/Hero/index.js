/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
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
      <ScrollButton />
    </StyledSection>
  )
}
