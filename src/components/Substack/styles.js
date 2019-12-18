import styled, { css } from 'styled-components'

import { rem } from '@utils'

export const FormWrapper = styled.div`
  margin-top: ${rem(40)};

  ${props =>
    props.subscribePage &&
    css`
      /* fallback */
      height: 100%;
      width: 90%;
      height: 100vh;
      width: 90vw;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
    `}
`

export const Iframe = styled.iframe`
  max-width: 100%;
`
