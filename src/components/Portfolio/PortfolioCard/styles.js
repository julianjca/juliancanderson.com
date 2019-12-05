import styled from 'styled-components'

import { rem } from '@utils'

export const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  border: 1px solid #00000060;
  border-radius: ${rem(20)};
  box-shadow: 0px 0px 2px 3px rgb(0, 0, 0, 0.1);
  & + & {
    margin-top: ${rem(40)};
  }
`

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rem(80)} ${rem(40)};
`

export const Image = styled.img`
  max-height: ${rem(250)};
  border-radius: ${rem(5)};
`
