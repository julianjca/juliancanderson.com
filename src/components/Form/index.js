import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { FormWrapper, Input, StyledForm, InputWrapper, Button } from './styles'

const useInput = ({ name }) => {
  const [value, setValue] = useState('')
  const onChange = e => setValue(e.target.value)
  return {
    value,
    onChange,
    name,
  }
}
export const Form = ({ subscribePage }) => {
  const bindFirstName = useInput('first_name')
  const bindEmail = useInput('email')
  const submitForm = useCallback(
    e => {
      e.preventDefault()
      const first_name = bindFirstName.value
      const email = bindEmail.value
      axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        url: 'https://api.convertkit.com/v3/forms/1184925/subscribe',
        data: {
          first_name,
          email,
          api_key: process.env.GATSBY_CONVERTKIT_API_KEY,
        },
      }).then(response => console.log(response))
    },
    [bindEmail, bindFirstName]
  )
  return (
    <FormWrapper subscribePage={subscribePage}>
      <StyledForm onSubmit={submitForm}>
        <InputWrapper>
          <Input
            type="text"
            {...bindFirstName}
            placeholder="your first name"
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="email"
            name="email"
            placeholder="your email"
            {...bindEmail}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Button>subscribe</Button>
        </InputWrapper>
      </StyledForm>
    </FormWrapper>
  )
}

Form.propTypes = {
  subscribePage: PropTypes.bool,
}

Form.defaultProps = {
  subscribePage: false,
}
