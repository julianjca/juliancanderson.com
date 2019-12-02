import styled from 'styled-components'

import { rem } from '../../utils'

export const StyledSection = styled.section`
  display: flex;
  max-width: ${rem(1200)};
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
`

export const Container = styled.div`
  padding: ${rem(80)} 0;
`
