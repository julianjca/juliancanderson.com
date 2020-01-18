import React from 'react'
import { graphql } from 'gatsby'
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
          {blogs.map(blog => (
            <Item key={blog.title}>
              <Text
                dangerouslySetInnerHTML={{ __html: blog.title }}
                href={blog.url}
                target="_blank"
                rel="noopener"
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
