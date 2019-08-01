export const isMobile = (width?: number) => (width || window.innerWidth) <= 700

export const isSmallMobile = () => window.innerWidth < 375

export const isMediumMobile = () => window.innerWidth >= 375 && window.innerWidth < 414

export const isLargeMobile = () => window.innerWidth >= 414 && window.innerWidth <= 700

export default {
  isMobile,
  isSmallMobile,
  isMediumMobile,
  isLargeMobile,
}
