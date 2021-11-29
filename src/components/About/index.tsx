/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'

import {
  StyledSection,
  Heading,
  Container,
  Grid,
  Paragraph,
  Text,
} from './styles'

export const About = () => {
  return (
    <StyledSection>
      <Container>
        <Heading>about.</Heading>
        <Grid>
          <Text>
            <Paragraph>
              I am an <strong>Industrial Engineering Graduate</strong> that
              turned into a <strong>Software Engineer</strong>. I rediscover my
              passion in tech in my last year of college and I went through a
              autodidact path when I first started. I mostly learned from
              articles and online courses. After a couple of months learning by
              myself I decided to enter a <strong>Coding Bootcamp</strong>{' '}
              called{' '}
              <a href="https://hacktiv8.com" target="_blank" rel="noopener">
                <strong>Hacktiv8</strong>
              </a>
              .
            </Paragraph>
            <Paragraph>
              I am currently working at <a href="https://latecheckout.studio">
                Late Checkout
              </a> as a Software Engineer (Front End, Backend, and Web3). In 2021 I've built a full stack web3 site called Crypto College.
              I wrote the Front End Code + the Smart Contract.
            </Paragraph>
            <Paragraph>
              Beside coding I also love doing some{' '}
              <a href="https://unsplash.com/@juliancanderson">
                <strong>photography</strong>
              </a>{' '}
              and writing. I love to write because it helps me to learn better
              and it can also help people who will learn the same thing through
              my{' '}
              <a
                href="https://dev.to/juliancanderson"
                target="_blank"
                rel="noopener"
              >
                <strong>articles</strong>
              </a>
              . I write{' '}
              <Link href="/blog">
                <a>
                  <strong>about things that I'm interested in</strong>
                </a>
              </Link>{' '}
              too!
            </Paragraph>
            <Paragraph>
              <strong>Past and Present Works</strong>
              <ul>
                 <li>
                  <a
                    href="https://cryptocollege.latecheckout.studio"
                    target="_blank"
                    rel="noopener"
                  >
                    Crypto College
                  </a>
                </li>
                <li>
                  <a
                    href="https://creatives.club"
                    target="_blank"
                    rel="noopener"
                  >
                    Creatives Club
                  </a>
                </li>
                <li>
                  <a
                    href="https://thirtydaysoflunch.com"
                    target="_blank"
                    rel="noopener"
                  >
                    Thirty Days of Lunch
                  </a>
                </li>
                <li>
                  <a href="https://jumpcut.com" target="_blank" rel="noopener">
                    Jumpcut
                  </a>
                </li>
                <li>
                  <a
                    href="https://hawaii.jumpcut.com/aots/sales"
                    target="_blank"
                    rel="noopener"
                  >
                    Jumpcut Art of The Startup
                  </a>
                </li>
                <li>
                  <a href="https://blibli.com" target="_blank" rel="noopener">
                    Blibli.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://hawaii.jumpcut.com/aim/sales"
                    target="_blank"
                    rel="noopener"
                  >
                    Automated Income Machine *reload the page to see the whole
                    page
                  </a>
                </li>

                <li>
                  <a
                    href="https://hawaii.jumpcut.com/1/va/video-4-FT"
                    target="_blank"
                    rel="noopener"
                  >
                    Viral Academy *reload the page to see the whole page
                  </a>
                </li>

                <li>
                  <a
                    href="https://hawaii.jumpcut.com/va/optin"
                    target="_blank"
                    rel="noopener"
                  >
                    Viral Academy Optin Page
                  </a>
                </li>
              </ul>
            </Paragraph>
          </Text>
        </Grid>
      </Container>
    </StyledSection>
  )
}
