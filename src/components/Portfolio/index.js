import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import { PortfolioCard } from './PortfolioCard'
import { StyledSection, Container, Heading, PortfoliosWrapper } from './styles'

const Portfolio = ({ portfolios }) => {
  return (
    <StyledSection>
      <Container>
        <Heading>Portfolio</Heading>
        <PortfoliosWrapper>
          {portfolios.map(portfolio => (
            <PortfolioCard key={portfolio.title} {...portfolio} />
          ))}
        </PortfoliosWrapper>
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

Portfolio.propTypes = {
  portfolios: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      description: PropTypes.string,
      stack: PropTypes.string,
    })
  ),
}

export default Portfolio
