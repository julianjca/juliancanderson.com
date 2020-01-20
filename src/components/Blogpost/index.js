import React from 'react'
import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'

import {
  StyledSection,
  Container,
  Heading,
  PortfoliosWrapper,
  Item,
  Text,
} from './styles'

const Blogpost = ({ blogs }) => {
  return (
    <StyledSection>
      <Container>
        <Heading>blogposts.</Heading>
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

export const query = graphql`
  query {
    cms {
      blogs {
        title
        url
      }
    }
  }
`

Blogpost.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })
  ),
}

export default Blogpost
