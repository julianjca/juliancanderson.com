import styled from '@emotion/styled'

import { rem } from '../../utils'


type ContainerProps = {
  subscribePage: boolean,
}

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 1.4;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${rem(24)};
  }
`

export const Subheading = styled.h2`
  font: normal 400 ${rem(14)} / 1.5 ${props => props.theme.fonts.secondary};
  width: 95%;
  margin-top: ${rem(15)};
  color: ${props => props.theme.colors.secondary};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 80%;
  }
`

export const Container = styled.div<ContainerProps>`
  padding: ${props => (props.subscribePage ? rem(60) : rem(20))} 0;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Form = styled.form`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    width: auto;
  }
`

export const Input = styled.input`
  border: none;
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  padding: ${rem(20)} ${rem(30)};
  border-radius: ${rem(5)};
  font-size: ${rem(16)};
  font-weight: 600;
  width: 100%;
  display: block;
  box-sizing: border-box;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: auto;
    display: inline-block;
  }

  & + & {
    margin-top: ${rem(30)};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      margin-left: ${rem(40)};
      margin-top: 0;
    }
  }

  &[type='submit'] {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    font-weight: 700;
    cursor: pointer;
  }
`
