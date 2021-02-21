import styled from '@emotion/styled'
import { css } from '@emotion/react'

import { rem } from '../../utils'

type SmallHeadingProps = {
  smallHeading?: boolean
}

export const StyledSection = styled.section`
  width: 100%;
`

export const Container = styled.div`
  padding: ${rem(20)} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
  text-align: left;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Heading = styled.h2<SmallHeadingProps>`
  font-size: ${rem(24)};
  font-weight: bold;
  font-family: ${props => props.theme.fonts.primary};

  ${props =>
    props.smallHeading &&
    css`
      font-size: ${rem(24)};
    `}
`

export const Wrapper = styled.ul`
  margin-top: ${rem(20)};
`

export const ButtonWrapper = styled.div`
  margin-top: ${rem(40)};
`

export const Button = styled.a`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: ${rem(5)};
  font-size: ${rem(16)};
  padding: ${rem(10)} ${rem(20)};
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s all ease-in-out;
  border: ${rem(2)} solid transparent;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transition: 0.2s all ease-in-out;
  }
`

export const Item = styled.li`
  /* width: calc(100% - 20px); */
  margin: 0 auto;
  transition: 0.25s all ease-in-out;
  display: list-item;
  list-style-type: disc;
  /* list-style-position: inside; */
  margin-left: 20px;
  box-sizing: border-box;

  & + & {
    margin-top: ${rem(15)};
  }

  a {
    font-size: ${rem(16)};
    font-weight: 600;
    width: 100%;
    line-height: 1.3;
    color: ${props => props.theme.colors.accent};
    font-family: ${props => props.theme.fonts.secondary};
    text-decoration: none;
    transition: 0.15s all ease-in-out;
    border-bottom: 1px solid transparent;

    &:hover {
      border-bottom: 1px solid ${props => props.theme.colors.accent};
      transition: 0.15s all ease-in-out;
    }
  }
`

export const Description = styled.p`
  margin-top: ${rem(10)};
  max-width: ${rem(700)};
  line-height: 1.7;
  font-size: ${rem(14)};
`
