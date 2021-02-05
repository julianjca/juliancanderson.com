/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import {
  StyledSection,
  Container,
  Heading,
  PortfoliosWrapper,
  Item,
} from './styles'

const Blogpost = ({ blogs }) => {
  return (
    <StyledSection>
      <Container>
        <Heading>
          a percent better.{' '}
          <Link
            style={{
              marginBottom: '20px',
              display: 'inline',
              textDecoration: 'none',
              color: '#1c1c1c',
              background: '#2ED1A2',
              padding: '2px 4px',
              borderRadius: '3px',
            }}
            href="/blog"
          >
            <a>View all</a>
          </Link>
        </Heading>
        <PortfoliosWrapper>
          {blogs.slice(0, 5).map(blog => (
            <Item key={blog.title}>
              <Link href={'/blog' + blog.url}>
                <a dangerouslySetInnerHTML={{ __html: blog.title }} />
              </Link>
            </Item>
          ))}
        </PortfoliosWrapper>
      </Container>
    </StyledSection>
  )
}

Blogpost.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })
  ),
}

export default Blogpost
