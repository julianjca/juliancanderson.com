import styled from '@emotion/styled'

import { rem } from '@utils'

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(900)};
  }
`
export const ContentWrapper = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;

  h2,
  h3 {
    margin-top: ${rem(25)};
  }

  h2 {
    font-size: ${rem(28)};
  }

  h3 {
    font-size: ${rem(24)};
  }

  p {
    margin-top: ${rem(15)};
    line-height: 1.7;
    font-size: ${rem(18)};
  }

  a {
    color: ${props => props.theme.colors.accent};
    font-weight: 500;
    text-decoration: none;
  }

  blockquote {
    font-size: ${rem(20)};
    font-style: italic;
    padding-left: ${rem(20)};
    border-left: ${rem(3)} solid #1c1c1c;
    margin: ${rem(30)} 0;
  }

  ul {
    list-style: circle;
    list-style-position: inside;
    font-size: ${rem(18)};
    margin-top: ${rem(10)};
    li {
      margin-top: ${rem(15)};
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(900)};
  }
`

export const Title = styled.h1`
  font-size: ${rem(50)};
  font-weight: bold;
  padding: ${rem(40)} 0 0;
`
