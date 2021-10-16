import styled from '@emotion/styled'

import { rem } from '../../utils'

type ContainerProps = {
  subscribePage: boolean
}

type ImageProps = {
  isSold?: boolean
}

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 1.4;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${rem(24)};
  }
`

export const Subheading = styled.h2`
  font: normal 400 ${rem(18)} / 1.5 ${props => props.theme.fonts.secondary};
  width: 95%;
  margin-top: ${rem(20)};
  color: ${props => props.theme.colors.primary};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 80%;
  }
`

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${rem(10)};
  margin-top: ${rem(20)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const Image = styled.img<ImageProps>`
  width: 100%;
  filter: ${props => props.isSold && 'grayscale(100%)'};
`
