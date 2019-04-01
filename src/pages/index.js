import React from 'react'
import { Helmet } from 'react-helmet';

import SEO from '../components/seo';
import TypingComponent from '../components/typing';
import Links from '../components/links';
import '../components/layout.css';


const IndexPage = () => (
  <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Julian Anderson - Web Developer</title>
        <link href="https://fonts.googleapis.com/css?family=Fjalla+One|Open+Sans:300,400,500,600,700,800,900 " rel="stylesheet" />

      </Helmet>
      <SEO title="Home" keywords={['react developer', 'software engineer', 'front end web developer', 'web developer']} />
      <div className="layout-wrapper">
        <h1>
          Julian Christian Anderson
        </h1>
        <TypingComponent />
      </div>
      <Links />
  </React.Fragment>

)

export default IndexPage
