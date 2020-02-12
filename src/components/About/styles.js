import styled from '@emotion/styled'
import { rem } from '../../utils'

import { FadeInCss } from '@components/FadeIn'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: bold;
  text-align: left;
  ${FadeInCss}
`

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(900)};
  }
`

export const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${rem(40)};
`

export const Image = styled.img`
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: inline-block;
    max-width: ${rem(500)};
  }
  ${FadeInCss}
`

export const Text = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: column nowrap;
  align-self: stretch;
  width: 100%;
  ${FadeInCss}
`

export const Paragraph = styled.p`
  text-align: left;
  font-size: ${rem(16)};
  line-height: 1.8;
  width: 100%;

  & + & {
    margin-top: ${rem(20)};
  }

  a {
    /* color: ${props => props.theme.colors.accent}; */
    text-decoration: none;
    position: relative;
    color: ${props => props.theme.colors.primary};
    z-index: 0;
    height: 100%;
    width: 100%;
    background: ${props => props.theme.colors.accent};
    padding: ${rem(2)};
    border-radius: 3px;
  }
  strong {
    font-weight: 700;
  }
`
