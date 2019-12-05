import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper } from './styles'
export { FadeInCss } from './styles'

export const FadeIn = ({ children, ...rest }) => (
  <Wrapper {...rest}>{children}</Wrapper>
)

FadeIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
