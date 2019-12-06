export const rem = (px, base = 16) => `${px / base}rem`

export const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)
