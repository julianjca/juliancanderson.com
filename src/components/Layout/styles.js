// import { createGlobalStyle } from 'styled-components'
import { css } from '@emotion/core'

export const GlobalStyle = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    /* font: inherit; */
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
    color: ${theme => theme.colors.primary};
    /* transition: 0.25s all ease-in-out; */
  }
  html {
    font: 400 100%/1 ${theme => theme.fonts.primary};
    text-rendering: optimizeLegibility;
    background: ${theme => theme.colors.background};
    transition: 0.25s all ease-in-out;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;

    @media (min-width: ${theme => theme.breakpoints.lg}) {
      font: 400 90%/1 ${theme => theme.fonts.primary};
    }
    @media (min-width: ${theme => theme.breakpoints.xl}) {
      font: 400 100%/1 ${theme => theme.fonts.primary};
    }
  }
  html,
  body {
    overflow-x: hidden;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  @import url('https://rsms.me/inter/inter.css');
  html {
    font-family: 'Inter', sans-serif;
  }
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Inter var', sans-serif;
    }
  }
  ::-moz-selection {
    /* Code for Firefox */
    background: #ff4040;
  }

  ::selection {
    background: #ff4040;
  }
`

export const lightTheme = {
  fonts: {
    primary: 'Inter, sans-serif',
    secondary: 'Inter, sans-serif',
  },
  breakpoints: {
    md: '720px',
    lg: '900px',
    xl: '1300px',
  },
  colors: {
    primary: '#1c1c1c',
    secondary: '#1c1c1c80',
    background: '#ffffff',
    accent: '#FF4040',
  },
}

export const darkTheme = {
  fonts: {
    primary: 'Inter, sans-serif',
    secondary: 'Inter, sans-serif',
  },
  breakpoints: {
    md: '720px',
    lg: '900px',
    xl: '1300px',
  },
  colors: {
    primary: '#ffffff',
    secondary: '#ffffff80',
    background: '#1c1c1c',
    accent: '#FF4040',
  },
}
