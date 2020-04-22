import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

import {
  StyledSection,
  Container,
  Heading,
  Wrapper,
  Item,
  Description,
} from './styles'

const Blogpost = ({ blogs, smallHeading }) => {
  return (
    <StyledSection>
      <Container>
        <Heading smallHeading={smallHeading}>writing</Heading>
        <Wrapper smallHeading={smallHeading}>
          {blogs.map(blog => (
            <Item key={blog.title}>
              <Link
                dangerouslySetInnerHTML={{ __html: blog.title }}
                to={blog.url !== '/now/' ? '/blog' + blog.url : '/now/'}
              />
              <Description>{blog.description}</Description>
            </Item>
          ))}
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
}

export default Blogpost
