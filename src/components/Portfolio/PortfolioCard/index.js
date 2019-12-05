import React from 'react'
import { Wrapper, Inner, Image } from './styles'

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
        <Image src={imageUrl} />
        <div>
          <h2>{title}</h2>
          <h2>{description}</h2>
          <h2>{link}</h2>
          <h2>{stack}</h2>
        </div>
      </Inner>
    </Wrapper>
  )
}
