import React from 'react'

import { StyledSection, Container, Heading } from './styles'

import { Substack } from '@components'

export const Subscribe = () => {
  return (
    <StyledSection>
      <Container>
        <Heading>
          SUBSCRIBE TO <br /> MY NEWSLETTER
        </Heading>
        <Substack />
      </Container>
    </StyledSection>
  )
}
