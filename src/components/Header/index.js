/* eslint-disable react/jsx-no-bind */
import React, { useCallback } from 'react'
import Toggle from 'react-toggle'
import PropTypes from 'prop-types'

import { StyledHeader, Logo, NavigationContainer, Item, Anchor } from './styles'
import { useTheme } from '../../Context/theme'
import { FadeIn } from '@components'

import sun from '@images/sun.svg'
import moon from '@images/moon.svg'

import { scrollToRef } from '@utils'

export const Header = ({ isReady, portfolioRef, aboutRef }) => {
  const { toggle, dark } = useTheme()
  const handleClick = useCallback(ref => {
    scrollToRef(ref)
  }, [])
  return (
    <FadeIn isReady={isReady} toBottom>
      <StyledHeader>
        <Logo>JULIAN ANDERSON</Logo>
        <NavigationContainer>
          <Item onClick={() => handleClick(aboutRef)}>About</Item>
          <Item onClick={() => handleClick(portfolioRef)}>Projects</Item>
          <Item>
            <Anchor href="mailto:juliancanderson@gmail.com">Contact</Anchor>
          </Item>
          <Item dark={dark}>
            <Toggle
              checked={!dark}
              icons={{
                checked: <img src={sun} alt="sun" />,
                unchecked: <img src={moon} alt="moon" />,
              }}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={() => toggle()}
            />
          </Item>
        </NavigationContainer>
      </StyledHeader>
    </FadeIn>
  )
}

Header.propTypes = {
  isReady: PropTypes.bool.isRequired,
}
