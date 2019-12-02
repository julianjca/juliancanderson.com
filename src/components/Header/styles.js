import styled from 'styled-components'
import { rem } from '../../utils'

export const StyledHeader = styled.header`
  max-width: ${rem(1000)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  margin: 0 auto;
  padding: ${rem(40)} 0;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
  }
`

export const Logo = styled.h2`
  font-size: ${rem(20)};
  font-weight: 700;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${rem(28)};
  }
`

export const NavigationContainer = styled.ul`
  display: flex;
`

export const Item = styled.li`
  font-family: ${props => props.theme.fonts.secondary};
  text-transform: uppercase;
  letter-spacing: ${rem(1)};
  font-size: ${rem(12)};
  transition: 0.2s all ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(${rem(-2)});
    transition: 0.2s all ease-in-out;
  }

  & + & {
    margin-left: ${rem(40)};
  }
`