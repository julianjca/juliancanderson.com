import styled from '@emotion/styled'

import { rem } from '@utils'

export const Wrapper = styled.li`
  width: 100%;
  margin: 0 auto;
  transition: 0.25s all ease-in-out;
  display: list-item;
  list-style-type: circle;
  list-style-position: inside;

  & + & {
    margin-top: ${rem(15)};
  }
`

export const Heading = styled.a`
  font-size: ${rem(16)};
  font-weight: 400;
  width: 100%;
  line-height: 1.2;
  color: ${props => props.theme.colors.accent};
  text-decoration: none;
  opacity: 0.8;
  transition: 0.25s all ease-in-out;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${props => props.theme.colors.accent};
    transition: 0.25s all ease-in-out;
  }
`
