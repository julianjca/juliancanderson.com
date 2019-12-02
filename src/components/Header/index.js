import React from 'react'
import Toggle from 'react-toggle'

import { StyledHeader, Logo, NavigationContainer, Item } from './styles'
import { useTheme } from '../../Context/theme'

import sun from '../../images/sun.svg'
import moon from '../../images/moon.svg'

export const Header = () => {
  const { toggle, dark } = useTheme()
  return (
    <StyledHeader>
      <Logo>JULIAN ANDERSON</Logo>
      <NavigationContainer>
        <Item>About</Item>
        <Item>Projects</Item>
        <Item>Contact</Item>
        <Item dark={dark}>
          <Toggle
            defaultChecked={true}
            icons={{
              checked: <img src={sun} />,
              unchecked: <img src={moon} />,
            }}
            onChange={() => toggle()}
          />
        </Item>
      </NavigationContainer>
    </StyledHeader>
  )
}
