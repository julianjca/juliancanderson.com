import { useRef, useEffect, useState } from 'react'
import { useScrollYPosition } from 'react-use-scroll-position'

const checkIsElementInViewPort = element => {
  const top = element.getBoundingClientRect().top
  return top >= 0 && top <= window.innerHeight
}

export const useOnScroll = () => {
  const [isInViewport, setIsInViewport] = useState(false)
  const scrollY = useScrollYPosition()

  const elementRef = useRef(null)

  useEffect(() => {
    if (checkIsElementInViewPort(elementRef.current)) {
      setIsInViewport(true)
    }
  }, [elementRef, scrollY])

  return [elementRef, isInViewport]
}
