import styled from 'styled-components'

import { rem } from '../../utils'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${rem(40)} 0 ${rem(60)};
  flex-flow: column wrap;
  max-width: ${rem(1200)};
  margin: 0 auto;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
  }
`

export const Left = styled.div``

export const Heading = styled.h1`
  font-size: ${rem(50)};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`

export const Subheading = styled.h3`
  font-size: ${rem(20)};
  font-weight: 500;
  margin-top: ${rem(10)};
  line-height: 1.3;
  color: ${props => props.theme.colors.secondary};
  max-width: ${rem(300)};
`

export const Image = styled.img`
  max-width: ${rem(500)};
`
