import React from 'react'
import PropTypes from 'prop-types'

import {
  Wrapper,
  Inner,
  Image,
  Heading,
  Text,
  Button,
  ButtonWrapper,
  Stack,
  Description,
} from './styles'

export const PortfolioCard = ({
  title,
  description,
  imageUrl,
  link,
  stack,
}) => {
  return (
    <Wrapper>
      <Inner>
        <Image imageUrl={imageUrl} />
        <Text>
          <Heading dangerouslySetInnerHTML={{ __html: title }} />
          <Description>{description}</Description>
          <Stack>{stack}</Stack>
          <ButtonWrapper>
            <Button href={link} target="_blank" rel="noopener">
              Visit Page
            </Button>
          </ButtonWrapper>
        </Text>
      </Inner>
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
