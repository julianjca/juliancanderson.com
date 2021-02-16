import React from 'react'

import { Layout, Subscribe, Header } from '../components'

import 'react-toggle/style.css'

const SubscribePage = () => {

  return (
    <>
      <Layout>
        <Header />
        <Subscribe subscribePage />
      </Layout>
    </>
  )
}

export default SubscribePage
