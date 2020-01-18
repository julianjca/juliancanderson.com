import React from 'react'

import { StyledSection, Container, Heading, Subheading } from './styles'
import { Form } from '@components'

export const Subscribe = () => {
  return (
    <StyledSection>
      <Container>
        <Heading>
          Get emails from me about coding, business, books, and self
          development.
        </Heading>
        <Subheading>
          I won't send you any spam. You can unsubscribe at any time.
        </Subheading>
        <Form />
      </Container>
    </StyledSection>
  )
}
