import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import { PortfolioCard } from './PortfolioCard'
import { StyledSection, Container, Heading, PortfoliosWrapper } from './styles'

const Portfolio = ({ portfolios, portfolioRef }) => {
  return (
    <StyledSection>
      <Container ref={portfolioRef}>
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
  portfolioRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
}

export default Portfolio
