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
          <Heading>Hi!</Heading>
          <Subheading>My name is Julian</Subheading>
        </Left>
        <Image src={hero} alt="hero" />
      </Container>
    </StyledSection>
  )
}
