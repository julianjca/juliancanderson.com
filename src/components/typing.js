import React from 'react'
import Typing from 'react-typing-animation';

const TypingComponent = () => (
  <Typing loop>
    <span>Web Developer</span>
    <Typing.Delay ms={100} />
    <Typing.Backspace count={20} />
    <span>Minimalist</span>
    <Typing.Delay ms={100} />
    <Typing.Backspace count={20} />
    <Typing.Reset count={1} delay={300} />
  </Typing>
)

export default TypingComponent;