import React from 'react'

import { StyledHeader, Logo, NavigationContainer, Item } from './styles'

export const Header = () => {
  return (
    <StyledHeader>
      <Logo>JULIAN ANDERSON</Logo>
      <NavigationContainer>
        <Item>Projects</Item>
        <Item>About</Item>
        <Item>Contact</Item>
      </NavigationContainer>
    </StyledHeader>
  )
}
