import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Wrapper, Item } from './styles'

const Blogpost = ({ blogs, smallHeading, title }) => {
  return (
    <StyledSection>
      <Container>
        <Heading smallHeading={smallHeading}>{title}</Heading>
        <Wrapper smallHeading={smallHeading}>
          <ul>
            {blogs.map(blog => (
              <Item key={blog.title}>
                <Link
                  dangerouslySetInnerHTML={{ __html: blog.title }}
                  to={blog.url !== '/now/' ? '/blog' + blog.url : '/now/'}
                />
                {/* <Description>{blog.description}</Description> */}
              </Item>
            ))}
          </ul>
        </Wrapper>
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
  smallHeading: PropTypes.bool,
  title: PropTypes.string,
}

export default Blogpost
