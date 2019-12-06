import styled from 'styled-components'

import { rem } from '@utils'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: 600;
  text-transform: uppercase;
`

export const Container = styled.div`
  padding: ${rem(80)} 0;
  max-width: ${rem(1200)};
  margin: 0 auto;
  width: 100%;
  text-align: center;
`

export const Form = styled.form`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`

export const Input = styled.input`
  border: none;
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  padding: ${rem(20)} ${rem(30)};
  border-radius: ${rem(5)};
  font-size: ${rem(16)};
  font-weight: 600;

  & + & {
    margin-left: ${rem(40)};
  }

  &[type='submit'] {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    font-weight: 700;
    cursor: pointer;
  }
`

export const FormWrapper = styled.div`
  margin-top: ${rem(60)};
`
