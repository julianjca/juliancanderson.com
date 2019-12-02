import React, { useState, useCallback } from 'react'
import { setConfig } from 'react-hot-loader'
import { Layout, Header, Hero } from '@components'

//github.com/gatsbyjs/gatsby/issues/9489
setConfig({ pureSFC: true })

const IndexPage = () => {
  const [isLightTheme, toggleTheme] = useState(true)

  const handleChangeTheme = useCallback(() => {
    toggleTheme(!isLightTheme)
  }, [isLightTheme])

  return (
    <Layout isLightTheme={isLightTheme}>
      <Header />
      <Hero />
      <button onClick={handleChangeTheme}>change theme</button>
    </Layout>
  )
}

export default IndexPage
