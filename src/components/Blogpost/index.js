import React from 'react'
import { Link } from 'gatsby'
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
          blogposts.{' '}
          <Link
            style={{
              marginTop: '20px',
              display: 'inline',
              textDecoration: 'none',
              color: '#1c1c1c',
              background: '#2ED1A2',
              padding: '2px 4px',
              borderRadius: '3px',
            }}
            to="/blog"
          >
            View All
          </Link>
        </Heading>
        <PortfoliosWrapper>
          {blogs.slice(0, 5).map(blog => (
            <Item key={blog.title}>
              <Link
                dangerouslySetInnerHTML={{ __html: blog.title }}
                to={'/blog' + blog.url}
              />
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
