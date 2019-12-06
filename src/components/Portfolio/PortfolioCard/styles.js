import styled from 'styled-components'

import { rem } from '@utils'

export const Wrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  border-radius: ${rem(20)};
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  transition: 0.25s all ease-in-out;

  & + & {
    margin-top: ${rem(60)};
  }

  &:hover {
    transform: scale(1.02);
    transition: 0.25s all ease-in-out;
    box-shadow: 0px 0px 20px 10px rgb(0, 0, 0, 0.1);
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    width: 80%;
  }
`

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rem(60)} ${rem(40)};
`

export const Image = styled.img`
  max-height: ${rem(250)};
  border-radius: ${rem(5)};
  box-shadow: 0px 0px 20px 10px rgb(0, 0, 0, 0.1);
`

export const Heading = styled.h4`
  font-size: ${rem(24)};
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 auto;
  width: 80%;
  line-height: 1.2;
`

export const Text = styled.div`
  width: 50%;
`

export const ButtonWrapper = styled.div`
  padding: ${rem(10)};
  margin: ${rem(20)} auto 0;
`

export const Button = styled.a`
  padding: ${rem(10)} ${rem(20)};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.primary};
  text-transform: uppercase;
  font-weight: 600;
  border-radius: ${rem(4)};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transition: all 0.2s ease-in-out;
  }
`

export const Stack = styled.h6`
  font-weight: bold;
  margin-top: ${rem(10)};
`

export const Description = styled.p`
  margin-top: ${rem(20)};
  font-family: ${props => props.theme.fonts.secondary};
`
