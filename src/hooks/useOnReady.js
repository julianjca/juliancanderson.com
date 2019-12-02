import { useState, useEffect } from 'react'

export const useOnReady = (duration = 1000) => {
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), duration)
    return () => {
      clearTimeout(timer)
    }
  }, [duration])

  return [isReady]
}
