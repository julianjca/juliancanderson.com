import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const FadeInCss = css`
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    opacity: ${({ isReady, isInViewport }) =>
      isReady || isInViewport ? 1 : 0};
    transition: 0.5s opacity, 0.5s transform;
      ${({ toTop }) =>
        toTop &&
        css`
          transform: ${({ isReady, isInViewport }) =>
            isReady || isInViewport ? 'none' : 'translateY(40px)'};
        `}
      ${({ toBottom }) =>
        toBottom &&
        css`
          transform: ${({ isReady, isInViewport }) =>
            isReady || isInViewport ? 'none' : 'translateY(-40px)'};
        `}
      ${({ toLeft }) =>
        toLeft &&
        css`
          transform: ${({ isReady, isInViewport }) =>
            isReady || isInViewport ? 'none' : 'translateX(40px)'};
        `}
      ${({ toRight }) =>
        toRight &&
        css`
          transform: ${({ isReady, isInViewport }) =>
            isReady || isInViewport ? 'none' : 'translateX(-40px)'};
        `};
    }
`

export const Wrapper = styled.div`
  ${props => props.cssProps}
  ${FadeInCss}
`
