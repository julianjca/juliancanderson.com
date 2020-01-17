import styled from '@emotion/styled'

import { rem } from '@utils'

export const Image = styled.div`
  width: 100%;
  height: ${rem(200)};
  border-radius: ${rem(5)};
  box-shadow: 0px 0px 20px 10px rgb(0, 0, 0, 0.1);
  background: url(${props => props.imageUrl}) center top / cover no-repeat;
  transition: 0.2s all ease-in-out;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    height: ${rem(250)};
    max-width: ${rem(400)};
  }
`

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  border-radius: ${rem(10)};
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  transition: 0.25s all ease-in-out;

  & + & {
    margin-top: ${rem(60)};
  }

  &:hover {
    transform: scale(1.02);
    transition: 0.25s all ease-in-out;
    box-shadow: 0px 0px 20px 10px rgb(0, 0, 0, 0.1);
    /* ${Image} {
      filter: none;
    } */
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    border-radius: ${rem(20)};
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    width: 80%;
  }
`

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: ${rem(40)} ${rem(20)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${rem(60)} ${rem(40)};
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`

export const Heading = styled.h4`
  font-size: ${rem(24)};
  font-weight: bold;
  text-transform: uppercase;
  margin: 0 auto;
  width: 100%;
  line-height: 1.2;

  br {
    display: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 80%;
    br {
      display: block;
    }
  }
`

export const Text = styled.div`
  width: 80%;
  margin-top: ${rem(40)};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-top: 0;
    width: 50%;
  }
`

export const ButtonWrapper = styled.div`
  padding: ${rem(10)};
  margin: ${rem(30)} auto 0;
`

export const Button = styled.a`
  padding: ${rem(10)} ${rem(20)};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.primary};
  text-transform: uppercase;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.primary};
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
  margin-top: ${rem(20)};
`

export const Description = styled.p`
  font-family: ${props => props.theme.fonts.secondary};
  line-height: 1.5;
  width: 90%;
  margin: ${rem(20)} auto 0;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 60%;
  }
`
