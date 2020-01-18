import styled from '@emotion/styled'

import { rem } from '../../utils'
import { FadeInCss } from '@components/FadeIn'

export const StyledSection = styled.section`
  display: block;
  text-align: center;
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: ${rem(20)} 0;
  flex-flow: column wrap;
  margin: 0 auto;
  max-width: 90vw;

  svg {
    order: 1;
    margin-left: ${rem(-50)};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      order: 2;
      margin-left: 0;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(900)};
  }
`

export const Left = styled.div`
  text-align: left;
  order: 2;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    order: 1;
  }
  ${FadeInCss}
`

export const Heading = styled.h1`
  font-size: ${rem(50)};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`

export const Subheading = styled.h3`
  font-size: ${rem(20)};
  font-weight: 400;
  font-family: ${props => props.theme.fonts.secondary};
  margin-top: ${rem(10)};
  line-height: 1.3;
  color: ${props => props.theme.colors.secondary};
  max-width: ${rem(300)};
`

export const Image = styled.img`
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: inline-block;
    max-width: ${rem(350)};
  }
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: inline-block;
    max-width: ${rem(500)};
  }
  ${FadeInCss}
`

export const ScrollButton = styled.div`
  border: 2px solid ${props => props.theme.colors.primary};
  height: ${rem(15)};
  width: ${rem(15)};
  border-width: 0px 2px 2px 0px;
  transform: rotate(45deg);
  margin: 0 auto;
  cursor: pointer;
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`
