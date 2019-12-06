import React from 'react'

import {
  StyledSection,
  Heading,
  Container,
  Grid,
  Paragraph,
  Text,
} from './styles'
import { Image } from '../Hero/styles'
import { useOnScroll } from '@hooks'

import AboutImage from '@images/about_image.jpg'

export const About = ({ aboutRef }) => {
  const [elementRef, isInViewport] = useOnScroll()
  const [headingRef, isHeadingOnViewport] = useOnScroll()

  return (
    <StyledSection ref={aboutRef}>
      <Container>
        <Heading ref={headingRef} isInViewport={isHeadingOnViewport} toTop>
          About
        </Heading>
        <Grid>
          <Image src={AboutImage} isInViewport={isInViewport} toRight />
          <Text isInViewport={isInViewport} toLeft>
            <Paragraph>
              I am an <strong>Industrial Engineering Graduate</strong> that
              turned into a <strong>Software Engineer</strong>. I rediscover my
              passion in tech in my last year of college and I went through a
              autodidact path when I first started. I mostly learned from
              articles and online courses. After a couple of months learning by
              myself I decided to enter a <strong>Coding Bootcamp</strong>{' '}
              called{' '}
              <a href="https://hacktiv8.com" target="_blank">
                <strong>Hacktiv8</strong>
              </a>
              .
            </Paragraph>
            <Paragraph ref={elementRef}>
              And after that the journey of becoming a Software Engineer was
              started. I learned a lot about Javascript inside the bootcamp.
              From <strong>Node JS, Vue, and React</strong>. I spent a lot of
              time exploring things that are outside of the Coding Bootcamp
              because I am passionate in what I do. I learned SCSS and also some
              CSS Animations.
            </Paragraph>
            <Paragraph>
              After I graduated I was hired to join a{' '}
              <strong>local tech startup</strong> in Indonesia. It was exciting
              because I can finally apply my knowledge in real world
              application. I have worked with both React and Vue professionally.
              I have also worked with Node JS and some of the backend stuffs.
              Right now I am currently working for{' '}
              <a href="https://jumpcut.com" target="_blank">
                <strong>Jumpcut</strong>
              </a>
            </Paragraph>
            <Paragraph>
              Beside coding I also love doing some{' '}
              <a href="https://instagram.com/juliancanderson">
                <strong>photography</strong>
              </a>{' '}
              and writing. I love to write because it helps me to learn better
              and it can also help people who will learn the same thing through
              my{' '}
              <a href="https://dev.to/juliancanderson" target="_blank">
                <strong>articles</strong>
              </a>
              . I write{' '}
              <a href="https://blog.juliancanderson.com" target="_blank">
                <strong>self development</strong>
              </a>{' '}
              articles too!
            </Paragraph>
          </Text>
        </Grid>
      </Container>
    </StyledSection>
  )
}
