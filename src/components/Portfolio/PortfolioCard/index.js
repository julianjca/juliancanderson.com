import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper, Heading } from './styles'

export const PortfolioCard = ({
  title,
  description,
  imageUrl,
  link,
  stack,
}) => {
  return (
    <Wrapper>
      <Heading
        dangerouslySetInnerHTML={{ __html: title }}
        href={link}
        target="_blank"
        rel="noopener"
      />
    </Wrapper>
  )
}

PortfolioCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  stack: PropTypes.string,
}
