/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import { StyledSection, Container, Heading, Wrapper, Item } from './styles'

interface Post {
  title: string;
  url: string;
}

type BlogPostProps = {
  smallHeading?: boolean,
  title?: string,
  blogs: Post[]
}

const Blogpost = ({ blogs, smallHeading = false, title }: BlogPostProps) => {
  return (
    <StyledSection>
      <Container>
        <Heading smallHeading={smallHeading}>{title}</Heading>
        <Wrapper>
          <ul>
            {blogs.map(blog => (
              <Item key={blog.title}>
                <Link href={'/blog/' + blog.url}>
                  <a dangerouslySetInnerHTML={{ __html: blog.title }} />
                </Link>
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
