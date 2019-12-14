import styled from 'styled-components'
import { rem } from '../../utils'

export const StyledHeader = styled.header`
  max-width: 90vw;
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
  font-size: ${rem(25)};
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
  display: flex;
  justify-content: center;
  align-items: center;

  &:not(:last-child) {
    &:hover {
      transform: translateY(${rem(-2)});
      transition: 0.2s all ease-in-out;
    }

    display: none;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      display: flex;
    }
  }

  & + & {
    margin-left: ${rem(40)};
  }

  .react-toggle-track-check {
    height: 15px;
    width: 15px;
  }
  .react-toggle--checked .react-toggle-thumb {
    border-color: transparent;
  }
  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track,
  .react-toggle-track,
  .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track,
  .react-toggle--checked .react-toggle-track {
    background: ${props => props.theme.colors.primary};
  }
  .react-toggle-thumb {
    background: ${({ dark }) => (!dark ? 'white' : 'black')};
  }
  .react-toggle--focus .react-toggle-thumb {
    box-shadow: 0 0 2px 3px #1a1a1a50;
  }
`

export const Anchor = styled.a`
  color: inherit;
  text-decoration: none;
`
