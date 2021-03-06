import styled from '@emotion/styled'
import { css } from '@emotion/react'

import { rem } from '../../utils'

export const StyledHeader = styled.header`
  max-width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  margin: 0 auto;
  padding: ${rem(40)} 0 ${rem(20)};

  a {
    text-decoration: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Logo = styled.h2`
  font-size: ${rem(18)};
  font-weight: 700;
  text-decoration: none;
  color: #1c1c1c;
  height: ${rem(20)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${rem(24)};
  }
`

export const NavigationContainer = styled.ul`
  display: flex;

  li + li {
    margin-left: ${rem(10)};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      margin-left: ${rem(40)};
    }
  }
`

export const Item = styled.li`
  font-family: ${props => props.theme.fonts.tertiary};
  text-transform: uppercase;
  letter-spacing: ${rem(1)};
  font-weight: 500;
  font-size: ${rem(12)};
  transition: 0.2s all ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${rem(20)};
  color: ${props => props.theme.colors.secondary};

  a {
    color: inherit;
    text-decoration: none;
  }
`

export const Anchor = styled.a`
  color: inherit;
  text-decoration: none;
`

export const Toggle = styled.div`
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.25s all ease-in-out;

  img {
    width: 15px;
    height: 15px;
  }
`
