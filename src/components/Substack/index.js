import React from 'react'
import PropTypes from 'prop-types'

import { FormWrapper, Iframe } from './styles'

export const Substack = ({ subscribePage }) => {
  return (
    <FormWrapper subscribePage={subscribePage}>
      <Iframe
        width="480"
        height="320"
        src="https://julianchristiananderson.substack.com/embed"
        frameborder="0"
        scrolling="no"
        title="Julian's Newsletter"
      />
    </FormWrapper>
  )
}

Substack.propTypes = {
  subscribePage: PropTypes.bool,
}

Substack.defaultProps = {
  subscribePage: false,
}
