import styled from '@emotion/styled'
import { rem } from '@utils'

export const FormWrapper = styled.div`
  margin-top: ${rem(20)};
`

export const StyledForm = styled.form`
  display: flex;
  align-items: flex-start;
  /* flex-direction: column; */
  flex-wrap: wrap;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`

export const Input = styled.input`
  border: 1px solid rgb(222, 222, 222);
  padding: ${rem(5)} ${rem(10)};
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 3px;
  font-family: ${props => props.theme.fonts.primary};
  font-size: ${rem(16)};
  height: ${rem(30)};
  border-radius: 3px;
  border-color: #dedede;
  box-shadow: none;
  font-weight: 400;
`

export const InputWrapper = styled.div`
  display: flex;
  flex: 0 0 100%;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex: 0 0 40%;
  }

  & + & {
    margin-top: ${rem(20)};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      margin-left: ${rem(20)};
      margin-top: 0;
    }
  }
`

export const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: ${rem(5)};
  font-size: ${rem(16)};
  font-family: ${props => props.theme.fonts.primary};
  padding: ${rem(5)} ${rem(20)};
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s all ease-in-out;
  border: ${rem(2)} solid transparent;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${rem(40)};
  width: 100%;
  box-sizing: border-box;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: auto;
  }

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transition: 0.2s all ease-in-out;
  }
`
