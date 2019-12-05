import styled from 'styled-components'

import { rem } from '../../utils'

import { FadeInCss } from '@components/FadeIn'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
  ${FadeInCss}
`

export const Container = styled.div`
  padding: ${rem(120)} 0;
  max-width: ${rem(1200)};
  margin: 0 auto;
  width: 100%;
  text-align: center;
`

export const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${rem(80)};
`

export const Image = styled.img`
  max-width: ${rem(500)};
  ${FadeInCss}
`

export const Text = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: column nowrap;
  align-self: stretch;
  width: 50%;
  ${FadeInCss}
`

export const Paragraph = styled.p`
  text-align: left;
  font-size: ${rem(16)};
  line-height: 1.8;
  width: 90%;

  & + & {
    margin-top: ${rem(20)};
  }

  a {
    color: inherit;
  }
  strong {
    font-weight: 700;
  }
`
