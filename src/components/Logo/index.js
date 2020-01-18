import React from 'react'

import { useTheme } from '../../Context/theme'

export const Logo = () => {
  const { dark: isDark } = useTheme()
  const color = isDark ? '#ffffff' : '#1C1C1C'
  const backgroundColor = isDark ? '#1C1C1C' : '#ffffff'

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22" cy="22" r="22" fill={color} />
      <path
        d="M22.5057 13.5455V25.7159C22.4972 27.3949 21.7472 28.2812 20.3835 28.2812C19.0966 28.2812 18.2614 27.4801 18.2358 26.0909H14.5625C14.5455 29.5767 17.0341 31.2386 20.196 31.2386C23.733 31.2386 26.1449 29.0994 26.1534 25.7159V13.5455H22.5057Z"
        fill={backgroundColor}
      />
    </svg>
  )
}
