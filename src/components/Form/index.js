// import React, { useCallback, useState } from 'react'
import React from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'

import { FormWrapper, Input, StyledForm, InputWrapper, Button } from './styles'

// const useInput = ({ name }) => {
//   const [value, setValue] = useState('')
//   const onChange = e => setValue(e.target.value)
//   return {
//     value,
//     onChange,
//     name,
//   }
// }
export const Form = ({ subscribePage }) => {
  // const bindFirstName = useInput('first_name')
  // const bindEmail = useInput('email')
  // const [submitSuccess, setSubmitSuccess] = useState(false)
  // const submitForm = useCallback(
  //   e => {
  //     e.preventDefault()
  //     const first_name = bindFirstName.value
  //     const email = bindEmail.value
  //     axios({
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json; charset=utf-8',
  //       },
  //       url: 'https://api.convertkit.com/v3/forms/1184925/subscribe',
  //       data: {
  //         first_name,
  //         email,
  //         api_key: process.env.GATSBY_CONVERTKIT_API_KEY,
  //       },
  //     }).then(response => setSubmitSuccess(true))
  //   },
  //   [bindEmail, bindFirstName]
  // )
  return (
    <FormWrapper>
      <StyledForm
        action="https://xyz.us18.list-manage.com/subscribe/post?u=d7a67503832690f773db3773c&amp;id=201a280d07"
        method="post"
        name="mc-embedded-subscribe-form"
        target="_blank"
        novalidate
      >
        <InputWrapper>
          <Input type="text" name="FNAME" placeholder="your first name" />
        </InputWrapper>
        <InputWrapper>
          <Input type="email" name="EMAIL" placeholder="your email" />
        </InputWrapper>
        <InputWrapper>
          <Button type="submit" value="Subscribe" name="subscribe">
            Subscribe
          </Button>
        </InputWrapper>
        <div id="mce-responses" className="clear">
          <div
            className="response"
            id="mce-error-response"
            style={{
              display: 'none',
            }}
          ></div>
          <div
            className="response"
            id="mce-success-response"
            style={{
              display: 'none',
            }}
          ></div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '-5000px',
          }}
          aria-hidden="true"
        >
          <Input
            type="text"
            name="b_d7a67503832690f773db3773c_201a280d07"
            tabindex="-1"
            value=""
          />
        </div>
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
