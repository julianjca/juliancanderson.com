import React from 'react'
import { Helmet } from 'react-helmet';
import { IoLogoGithub, IoLogoInstagram, IoMdMail, IoLogoLinkedin } from "react-icons/io";
import Typing from 'react-typing-animation';

import SEO from '../components/seo';

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
        <Typing loop>
          <span>Web Developer</span>
          <Typing.Delay ms={100} />
          <Typing.Backspace count={20} />
          <span>Minimalist</span>
          <Typing.Delay ms={100} />
          <Typing.Backspace count={20} />
          <Typing.Reset count={1} delay={300} />
        </Typing>
      </div>
      <div className="bottom-layout">
        <IoLogoGithub/>
        <IoLogoInstagram/>
        <IoMdMail/>
        <IoLogoLinkedin/>
      </div>
  </React.Fragment>

)

export default IndexPage
