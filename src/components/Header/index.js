/* eslint-disable react/jsx-no-bind */
import React from 'react'
// import Toggle from 'react-toggle'
import { Link } from 'gatsby'

import { StyledHeader, NavigationContainer, Item, Logo } from './styles'

export const Header = () => {
  return (
    <StyledHeader>
      <Link to="/">
        <Logo>juliancanderson</Logo>
      </Link>
      <NavigationContainer>
        <Item>
          <Link to="/now">Now</Link>
        </Item>
        <Item>
          <Link to="/bookshelf">Bookshelf</Link>
        </Item>
        {/* <Item hideOnMobile>
          <Anchor href="mailto:hello@juliancanderson.com">Contact</Anchor>
        </Item> */}
        <Item>
          <a href="https://notes.julian.so" target="_blank">
            Notes
          </a>
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
