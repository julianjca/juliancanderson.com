/* eslint-disable react/jsx-no-bind */
import React from 'react'
// import Toggle from 'react-toggle'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

// import { rem } from '@utils'

import { StyledHeader, NavigationContainer, Item, Anchor } from './styles'
// import { useTheme } from '../../Context/theme'
import { Logo } from '@components'

// import sun from '@images/sun.svg'
// import moon from '@images/moon.svg'

export const Header = ({
  isReady,
  portfolioRef,
  newsletterRef,
  blogPost,
  hideMobileHeader,
}) => {
  return (
    <StyledHeader>
      <Link to="/">
        <Logo />
      </Link>
      <NavigationContainer>
        <Item>
          <Link to="/now">Now</Link>
        </Item>
        <Item hideOnMobile>
          <Link to="/subscribe">Newsletter</Link>
        </Item>
        <Item>
          <Anchor href="mailto:hello@juliancanderson.com">Contact</Anchor>
        </Item>
        <Item>
          <Link to="/blog">Blog</Link>
        </Item>

        {/* //TODO fix darkTheme */}
        {/* <Item
          style={{
            marginLeft: rem(40),
          }}
        >
          <Toggle onClick={() => toggle()}>
            {!dark ? (
              <img src={sun} alt="sun" />
            ) : (
              <img src={moon} alt="moon" />
            )}
          </Toggle>
        </Item> */}
      </NavigationContainer>
    </StyledHeader>
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
  blogPost: PropTypes.bool,
  hideMobileHeader: PropTypes.bool,
}
