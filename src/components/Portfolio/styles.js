import styled from '@emotion/styled'

import { rem } from '@utils'

export const StyledSection = styled.section`
  width: 100%;
`

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
  text-align: left;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(800)};
  }
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: bold;
  font-family: ${props => props.theme.fonts.primary};
`

export const PortfoliosWrapper = styled.ul`
  margin-top: ${rem(20)};
`

export const ButtonWrapper = styled.div`
  margin-top: ${rem(40)};
`

export const Button = styled.a`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: ${rem(5)};
  font-size: ${rem(16)};
  padding: ${rem(10)} ${rem(20)};
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
