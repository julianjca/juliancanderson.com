/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react'

const defaultThemeContext = {
  dark: true,
  toggle: () => {},
}

const ThemeContext = createContext(defaultThemeContext)

export const useTheme = () => useContext(ThemeContext)

const useDarkMode = () => {
  const [theme, setTheme] = useState({
    dark: false,
  })

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light'
    setTheme({ ...theme, dark: currentTheme === 'dark' })
  }, [])

  return [theme, setTheme]
}

export const DarkModeProvider = ({ children }) => {
  const [theme, setTheme] = useDarkMode()

  const toggle = () => {
    localStorage.setItem('theme', theme === 'dark' ? 'dark' : 'light')
    setTheme({ ...theme, dark: !theme.dark })
  }

  return (
    <ThemeContext.Provider value={{ dark: theme.dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
