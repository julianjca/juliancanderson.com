/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { StyledSection, Container, Heading, Left, Subheading } from './styles'
// import { FaceIllustration } from '@components'

export const Hero = () => {
  return (
    <StyledSection>
      <Container>
        <Left>
          <Heading>hello!</Heading>
          <Subheading>
            my name is Julian,
            <br /> a software engineer @ Late Checkout <br />
            check out my{' '}
            <a
              href="https://github.com/julianjca"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '15px',
                textDecoration: 'none',
                color: '#2ED1A2',
                fontWeight: 600,
              }}
            >
              github
            </a>
            {/* <br /> a software engineer. <br /> a writer.{' '}
            <br /> a reader. <br /> a learner. */}
          </Subheading>
          <Link href="/about">
            <a
              style={{
                marginTop: '15px',
                display: 'block',
                textDecoration: 'none',
                color: '#2ED1A2',
                fontWeight: 600,
              }}
            >
              more about me
            </a>
          </Link>
        </Left>
        {/* <FaceIllustration /> */}
      </Container>
    </StyledSection>
  )
}

Hero.propTypes = {
  isReady: PropTypes.bool,
  aboutRef: PropTypes.object,
}
