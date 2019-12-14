import React from 'react'

import {
  StyledSection,
  Container,
  Heading,
  FormWrapper,
  Iframe,
} from './styles'

export const Subscribe = () => {
  return (
    <StyledSection>
      <Container>
        <Heading>
          SUBSCRIBE TO MY <br /> EMAIL LIST
        </Heading>
        <FormWrapper>
          <Iframe
            width="480"
            height="320"
            src="https://julianchristiananderson.substack.com/embed"
            frameborder="0"
            scrolling="no"
            title="Julian's Newsletter"
          />
        </FormWrapper>
      </Container>
    </StyledSection>
  )
}
