import React from 'react'
import PropTypes from 'prop-types'

import { FormWrapper, Input, StyledForm, InputWrapper, Button } from './styles'

export const Form = ({ subscribePage }) => {
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
