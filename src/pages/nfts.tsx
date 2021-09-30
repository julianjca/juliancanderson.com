import React from 'react'

import { Layout, Subscribe, Header } from '../components'

import 'react-toggle/style.css'
import { NFTs } from '../components/NFTs'

const SubscribePage = () => {

  return (
    <>
      <Layout>
        <Header />
        <NFTs />
      </Layout>
    </>
  )
}

export default SubscribePage
