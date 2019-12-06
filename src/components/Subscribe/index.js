import React, { useCallback, useState } from 'react'

import {
  StyledSection,
  Container,
  Heading,
  Form,
  Input,
  FormWrapper,
} from './styles'

const useInput = name => {
  const [value, setValue] = useState('')
  const onChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  return {
    value,
    onChange,
    name,
  }
}

export const Subscribe = () => {
  const bindName = useInput('FNAME')
  const bindEmail = useInput('EMAIL')

  return (
    <StyledSection>
      <Container>
        <Heading>
          SUBSCRIBE TO MY <br /> EMAIL LIST
        </Heading>
        <FormWrapper>
          <Form
            action="https://xyz.us18.list-manage.com/subscribe/post?u=d7a67503832690f773db3773c&amp;id=201a280d07"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            class="validate"
            target="_blank"
            novalidate
            autoComplete="off"
          >
            <Input
              type="text"
              value=""
              name="FNAME"
              class=""
              id="mce-FNAME"
              placeholder="Your First Name"
              {...bindName}
            />
            <Input
              type="email"
              value=""
              name="EMAIL"
              class="required email"
              id="mce-EMAIL"
              placeholder="Your Email"
              {...bindEmail}
            />
            <Input
              type="submit"
              value="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe"
              class="button"
            />
          </Form>
        </FormWrapper>
        {/* <iframe
          width="480"
          height="320"
          title="Substack"
          src="https://julianchristiananderson.substack.com/embed"
          frameborder="0"
          scrolling="no"
        /> */}
      </Container>
    </StyledSection>
  )
}
