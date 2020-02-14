import styled from '@emotion/styled'

import { rem } from '@utils'

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;

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

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${rem(600)};
    max-width: 70ch;
  }
`
export const ContentWrapper = styled.div`
  padding: ${rem(5)} 0;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${rem(20)} 0;
  }

  .gatsby-resp-image-wrapper {
    pointer-events: none;
  }

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
    font-size: ${rem(16)};
  }

  a, code {
    /* color: ${props => props.theme.colors.accent}; */
    text-decoration: none;
    position: relative;
    color: ${props => props.theme.colors.primary};
    z-index: 0;
    height: 100%;
    width: 100%;
    background: ${props => props.theme.colors.accent};
    padding: ${rem(2)} ${rem(3)};
    border-radius: 3px;
    font-weight: bold;
    font-family: ${props => props.theme.fonts.primary};
  }

  code {
    font-weight: 600;
  }

  hr {
    margin: ${rem(40)} 0;
    border: 0.4px solid #1c1c1c50;
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
    font-size: ${rem(16)};
    margin-top: ${rem(10)};

    li {
      margin-top: ${rem(4)};
      line-height: 1.7;
    }
  }

`

export const Title = styled.h1`
  font-size: ${rem(30)};
  font-weight: bold;
  padding: ${rem(40)} 0 0;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${rem(40)};
  }
`
