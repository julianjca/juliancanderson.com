import styled from 'styled-components'

import { rem } from '@utils'

export const Wrapper = styled.section`
  max-width: 300px;
  padding: ${rem(60)} 0;
  margin: 0 auto;

  @media (min-width: 375px) {
    max-width: 330px;
  }
  @media (min-width: 400px) {
    max-width: 360px;
  }
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  text-transform: uppercase;
  font-weight: bold;
`

export const List = styled.div`
  margin-top: ${rem(50)};
`

export const Card = styled.div`
  width: 100%;
  margin: 0 auto;
  border-radius: ${rem(5)};
  transition: 0.25s all ease-in-out;
  padding: ${rem(20)} 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #1c1c1c;

  & + & {
    margin-top: ${rem(20)};
  }

  &:hover {
    transform: scale(1.02);
    transition: 0.25s all ease-in-out;
    box-shadow: 0px 0px 20px 10px rgb(0, 0, 0, 0.1);
  }
`

export const Link = styled.a`
  font-weight: 600;
  color: white;
  text-decoration: none;
`
