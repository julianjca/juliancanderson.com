
import React from 'react'
import Layout from '../components/layout'
import { StaticQuery, graphql } from 'gatsby'
import Card from '../components/Card'

const IndexPage = () => (
  <Layout>
  <StaticQuery
    query={graphql`
      query {
        gcms {
          resources {
            id
            type
            url
          }
        }
      }
    `}
    render={data => {
      if (!data.gcms) {
        return <p>Loading…</p>
      }
      return data.gcms.resources.map(d =>
        <Card
          title={d.type}
          key={d.id}
          // elevation={d.elevation}
          // src={d.image ? d.image.url : undefined}
        />
        )
    }}
    />
  </Layout>
)

export default IndexPage
