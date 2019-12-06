import styled from 'styled-components'

import { rem } from '@utils'

export const StyledSection = styled.section`
  width: 100%;
`

export const Container = styled.div`
  padding: ${rem(80)} 0;
  max-width: ${rem(1000)};
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(1200)};
  }
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
`

export const PortfoliosWrapper = styled.div`
  margin-top: ${rem(80)};
`
