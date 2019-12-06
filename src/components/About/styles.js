import styled, { css } from 'styled-components'

import { rem } from '../../utils'

import { FadeInCss } from '@components/FadeIn'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
  text-align: left;
  ${FadeInCss}

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    text-align: center;
  }
`

export const Container = styled.div`
  padding: ${rem(40)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
    padding: ${rem(80)} 0;
  }
`

export const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${rem(40)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-top: ${rem(80)};
  }
`

export const Image = styled.img`
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: inline-block;
    max-width: ${rem(500)};
  }
  ${FadeInCss}
`

export const Text = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: column nowrap;
  align-self: stretch;
  width: 100%;
  ${FadeInCss}

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 50%;
  }
`

export const Paragraph = styled.p`
  text-align: left;
  font-size: ${rem(16)};
  line-height: 1.8;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 90%;
  }

  & + & {
    margin-top: ${rem(20)};
  }

  a {
    color: inherit;
  }
  strong {
    font-weight: 700;
  }
`
