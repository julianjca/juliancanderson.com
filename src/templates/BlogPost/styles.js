import styled from '@emotion/styled'

import { rem } from '@utils'

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;

  .spotify {
    margin-top: ${rem(20)};
  }

  .videoWrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
  }
  .videoWrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

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

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(600)};
    max-width: 70ch;
  }
`
export const ContentWrapper = styled.div`
  padding: ${rem(5)} 0;
  margin: 0 auto;
  width: 100%;
  font-family: 'Roboto Slab';

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 0 ${rem(20)};
  }

  .gatsby-resp-image-wrapper {
    pointer-events: none;
    .gatsby-resp-image-link {
      background: none;
    }
  }

  em {
    font-weight: 600;
    font-style: italic;
  }

  h2,
  h3 {
    margin-top: ${rem(25)};
    color: #2d2d2d;
    line-height: 1.4;
  }

  h2 {
    font-size: ${rem(26)};
  }

  h3 {
    font-size: ${rem(22)};
  }

  h4 {
    margin-top: ${rem(24)};
    font-size: ${rem(18)};
    color: #2d2d2d;
    line-height: 1.4;

    & + p {
      margin-top: ${rem(14)};
    }
  }

  p {
    margin-top: ${rem(15)};
    line-height: 1.8;
    font-size: ${rem(16)};
    color: #404040;
    font-weight: 400;
  }

  code {
    /* color: ${props => props.theme.colors.accent}; */
    text-decoration: none;
    position: relative;
    color: ${props => props.theme.colors.primary};
    z-index: 0;
    height: 100%;
    width: 100%;
    background: ${props => props.theme.colors.accent}95;
    padding: ${rem(2)} ${rem(3)};
    border-radius: 3px;
    font-weight: 500;
    font-family: ${props => props.theme.fonts.primary};
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: 0.25s all ease-in-out;
    border-bottom: 1px solid transparent;
    font-weight: 500;

    &:hover {
      border-bottom: 1px solid ${props => props.theme.colors.accent};
      transition: 0.25s all ease-in-out;
    }
  }

  code {
    font-weight: 600;
  }

  hr {
    margin: ${rem(40)} 0;
    border: 0.05px solid #1c1c1c10;
  }

  blockquote {
    font-size: ${rem(20)};
    font-style: italic;
    padding-left: ${rem(20)};
    border-left: ${rem(3)} solid #1c1c1c;
    margin: ${rem(30)} 0;
  }

  ul {
    list-style-type: disc;
    font-size: ${rem(16)};
    margin-top: ${rem(10)};
    color: #404040;

    li {
      margin-top: ${rem(4)};
      line-height: 1.5;
      list-style-type: disc;
      margin-left: 20px;

      @media (min-width: ${props => props.theme.breakpoints.md}) {
        list-style-position: outside;
        /* text-indent: 1em; */
        /* margin-left: 0; */
      }
    }
  }

  .videoWrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    margin: 25px 0;
  }

  .videoWrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .progress-wrapper {
    display: flex; 
    align-items: center; 
    max-width: ${rem(280)};
    margin-top: ${rem(4)};
    
    .progress-bar {
      width: 100%; 
      height: 15px;  
      display:inline-block; 
      margin-right: 10px; 
      border-radius: 2px;
      background: #b1b1b1; 


      position: relative;

      .inner {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 2px;
        background: #1c1c1c90; 
      }
      
    }
  }

`

export const Title = styled.h1`
  font-size: ${rem(30)};
  font-weight: bold;
  padding: ${rem(20)} 0 0;
  line-height: 1.4;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${rem(40)} 0 0;
  }
`

export const StyledDate = styled.div`
  font-family: ${props => props.theme.fonts.tertiary};
  font-size: ${rem(14)};
  color: ${props => props.theme.colors.secondary};
  margin: ${rem(10)} 0 ${rem(30)};
`
