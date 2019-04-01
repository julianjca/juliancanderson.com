import React from 'react';
import { IoLogoGithub, IoLogoInstagram, IoMdMail, IoLogoLinkedin, IoIosMic,IoMdJournal } from "react-icons/io";

const Links = () => (
  <div className="bottom-layout">
    <a href="https://github.com/julianjca" target="blank"><IoLogoGithub/></a>
    <a href="https://instagram.com/juliancanderson" target="blank"><IoLogoInstagram/></a>
    <a href="mailto:hello@juliancanderson.com"><IoMdMail/></a>
    <a href="https://www.linkedin.com/in/juliancanderson/" target="blank"><IoLogoLinkedin/></a>
    <a href="https://open.spotify.com/show/6pzJgcYA7XCOKJz8Hi7QXw" target="blank"><IoIosMic/></a>
    <a href="https://blog.juliancanderson.com" target="blank" className="medium-icon"><IoMdJournal/></a>
  </div>
);

export default Links;
