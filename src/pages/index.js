import React from 'react'
import { Helmet } from 'react-helmet';

import SEO from '../components/seo';

const IndexPage = () => (
  <div className="layout-wrapper">
    <div className="layout-page">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Julian Anderson - Web Developer</title>
        <link href="https://fonts.googleapis.com/css?family=Fjalla+One|Open+Sans:300,400,500,600,700,800,900 " rel="stylesheet" />

      </Helmet>
      <SEO title="Home" keywords={['react developer', 'software engineer', 'front end web developer', 'web developer']} />
      <h1>
        Julian Christian Anderson
      </h1>
    </div>
  </div>

)

export default IndexPage
