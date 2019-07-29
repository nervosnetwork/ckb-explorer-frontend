export const isMobile = (width?: number) => (width || window.innerWidth) <= 700

export const isSmallMobile = () => window.innerWidth <= 320

export const isMediumMobile = () => window.innerWidth <= 375

export const isLargeMobile = () => window.innerWidth <= 414 || isMobile()

export default {
  isMobile,
  isSmallMobile,
  isMediumMobile,
  isLargeMobile,
}
