import styled from 'styled-components'

import { rem } from '@utils'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
`

export const Container = styled.div`
  padding: ${rem(80)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
  }
`

export const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

export const Copyright = styled.h4``

export const SocialMedia = styled.div`
  display: flex;
`

export const Item = styled.a`
  text-decoration: none;
  cursor: pointer;

  & + & {
    margin-left: ${rem(20)};
  }
`

export const Logo = styled.svg`
  fill: ${props => props.theme.colors.primary};
`
