import styled from 'styled-components'

import { rem } from '@utils'

export const StyledSection = styled.section`
  width: 100%;
`

export const Container = styled.div`
  padding: ${rem(40)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${rem(80)} 0;
  }
  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
  }
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: bold;
  font-family: ${props => props.theme.fonts.primary};
  text-transform: uppercase;
`

export const PortfoliosWrapper = styled.div`
  margin-top: ${rem(40)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-top: ${rem(80)};
  }
`

export const ButtonWrapper = styled.div`
  margin-top: ${rem(80)};
`

export const Button = styled.a`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: ${rem(5)};
  font-size: ${rem(20)};
  padding: ${rem(15)} ${rem(30)};
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s all ease-in-out;
  border: ${rem(2)} solid transparent;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transition: 0.2s all ease-in-out;
  }
`
