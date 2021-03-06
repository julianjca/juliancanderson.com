import styled from '@emotion/styled'
import { rem } from '../../utils'

export const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  font-size: ${rem(30)};
  font-weight: bold;
  text-align: left;
`

export const Container = styled.div`
  padding: ${rem(40)} 0 ${rem(20)};
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    max-width: ${rem(700)};
  }
`

export const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${rem(20)};
`

export const Image = styled.img`
  box-shadow: 0px 0px 20px 5px rgb(0, 0, 0, 0.1);
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: inline-block;
    max-width: ${rem(500)};
  }
`

export const Text = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: column nowrap;
  align-self: stretch;
  width: 100%;
`

export const Paragraph = styled.p`
  text-align: left;
  font-size: ${rem(16)};
  line-height: 1.8;
  width: 100%;
  font-family: ${props => props.theme.fonts.secondary};

  & + & {
    margin-top: ${rem(20)};
  }

  a {
    /* color: ${props => props.theme.colors.accent}; */
    text-decoration: underline;
    position: relative;
    color: #00C78B;
    z-index: 0;
    height: 100%;
    width: 100%;
    padding: ${rem(2)};
    border-radius: 3px;
    font-weight: 600;
  }

  strong {
    font-weight: 600;
  }

  ul {
    list-style-type: disc;
    font-size: ${rem(16)};
    margin-top: ${rem(10)};
    color: #404040;

    li {
      margin-top: ${rem(4)};
      line-height: 1.5;
      list-style-type: disc;
      margin-left: 20px;

      /* @media (min-width: ${props => props.theme.breakpoints.md}) {
        list-style-position: outside;
        text-indent: 1em;
        margin-left: 0;
      } */
    }
  }
`
