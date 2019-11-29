import styled from 'styled-components'
import { rem } from '../../utils'

export const StyledHeader = styled.header`
  max-width: ${rem(1000)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  margin: 0 auto;
  padding: ${rem(40)} 0;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
  }
`

export const Logo = styled.h2`
  font-size: ${rem(30)};
  font-weight: 700;
`

export const NavigationContainer = styled.ul`
  display: flex;
`

export const Item = styled.li`
  font-family: ${props => props.theme.fonts.secondary};
  text-transform: uppercase;
  letter-spacing: ${rem(2)};

  & + & {
    margin-left: ${rem(40)};
  }
`
