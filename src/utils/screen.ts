export const isMobile = (): boolean => {
  return window.innerWidth <= 700
}

export const isSmallMobile = (): boolean => {
  return window.innerWidth <= 320
}

export default {
  isMobile,
  isSmallMobile,
}
