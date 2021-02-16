import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    fonts: {
      primary: string,
      secondary: string,
      tertiary: string,
    },
    breakpoints: {
      md: string,
      lg: string,
      xl: string,
    },
    colors: {
      primary: string,
      secondary: string,
      background:string,
      accent: string,
    },
  }
}