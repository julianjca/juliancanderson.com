import styled from '@emotion/styled'

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
  padding: ${rem(40)} 0;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  max-width: 90%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

export const Copyright = styled.h4`
  font-weight: 400;
  /* opacity: 80%; */
  font-size: ${rem(16)};
  color: #1c1c1c90;
`

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
