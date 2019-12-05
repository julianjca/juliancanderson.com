import React from 'react'
import { graphql } from 'gatsby'

import { PortfolioCard } from './PortfolioCard'
import { StyledSection, Container } from './styles'

export default ({ portfolios }) => {
  console.log(portfolios)
  return (
    <StyledSection>
      <Container>
        {portfolios.map(portfolio => (
          <PortfolioCard {...portfolio} />
        ))}
      </Container>
    </StyledSection>
  )
}

export const query = graphql`
  query {
    cms {
      portfolios {
        title
        description
        imageUrl
        link
        stack
      }
    }
  }
`
