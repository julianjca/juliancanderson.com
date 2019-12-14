import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import { PortfolioCard } from './PortfolioCard'
import {
  StyledSection,
  Container,
  Heading,
  PortfoliosWrapper,
  Button,
  ButtonWrapper,
} from './styles'

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
        <ButtonWrapper>
          <Button
            href="https://paper.dropbox.com/doc/Julian-Christian-Anderson--Aqbg042_Q~ihUgSrdR_GBhODAg-LOMtWZSenxehLyDFkh6an"
            target="_blank"
            rel="noopener"
          >
            View My CV
          </Button>
        </ButtonWrapper>
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
