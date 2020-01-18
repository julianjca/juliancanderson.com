/* eslint-disable react/jsx-no-bind */
import React, { useCallback } from 'react'
import Toggle from 'react-toggle'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { StyledHeader, NavigationContainer, Item, Anchor } from './styles'
import { useTheme } from '../../Context/theme'
import { FadeIn, Logo } from '@components'

import sun from '@images/sun.svg'
import moon from '@images/moon.svg'

import { scrollToRef } from '@utils'

export const Header = ({ isReady, portfolioRef, newsletterRef }) => {
  const { toggle, dark } = useTheme()
  const handleClick = useCallback(ref => {
    scrollToRef(ref)
  }, [])
  return (
    <FadeIn isReady={isReady} toBottom>
      <StyledHeader>
        <Link to="/">
          <Logo />
        </Link>
        <NavigationContainer>
          <Item onClick={() => handleClick(newsletterRef)}>Newsletter</Item>
          <Item onClick={() => handleClick(portfolioRef)}>Projects</Item>
          <Item>
            <Anchor href="mailto:juliancanderson@gmail.com">Contact</Anchor>
          </Item>
          <Item>
            <Anchor
              href="https://blog.juliancanderson.com"
              target="_blank"
              rel="noopener"
            >
              Blog
            </Anchor>
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

// https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
Header.propTypes = {
  isReady: PropTypes.bool.isRequired,
  portfolioRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  newsletterRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
}
