import React from 'react'

import { StyledSection, Container, Heading, Subheading } from './styles'

type SubscribePageProps = {
  subscribePage?: boolean,
}

export const Subscribe = ({ subscribePage = false } : SubscribePageProps) => {
  return (
    <StyledSection>
      <Container subscribePage={subscribePage}>
        <Heading>You can subscribe for future posts here.</Heading>
        <Subheading>
          I won't send you any spam. You can unsubscribe at any time.
        </Subheading>
        {/* https://www.reddit.com/r/Substack/comments/gldo52/has_anyone_created_a_custom_landing_page_for/ */}
        <iframe
          src="https://juliancanderson.substack.com/embed"
          width="320"
          height="80"
          frameBorder="0"
          scrolling="no"
          title="substack"
          style={{
            marginLeft: '-20px',
            marginTop: '20px',
          }}
        ></iframe>
      </Container>
    </StyledSection>
  )
}
