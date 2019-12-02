import React from 'react'

import { StyledHeader, Logo, NavigationContainer, Item } from './styles'

export const Header = () => {
  return (
    <StyledHeader>
      <Logo>JULIAN ANDERSON</Logo>
      <NavigationContainer>
        <Item>About</Item>
        <Item>Projects</Item>
        <Item>Contact</Item>
      </NavigationContainer>
    </StyledHeader>
  )
}
