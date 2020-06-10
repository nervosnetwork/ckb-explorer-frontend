export const isMobile = (width?: number) => (width || window.innerWidth) <= 750

export const isSmallMobile = () => window.innerWidth < 375

export const isMediumMobile = () => window.innerWidth >= 375 && window.innerWidth < 414

export const isLargeMobile = () => window.innerWidth >= 414 && window.innerWidth <= 750

export const isScreen750to1440 = () => window.innerWidth >= 750 && window.innerWidth < 1440

export const isScreenSmallerThan1200 = () => window.innerWidth <= 1200

export const isScreenSmallerThan1440 = () => window.innerWidth <= 1440

export default {
  isMobile,
  isSmallMobile,
  isMediumMobile,
  isLargeMobile,
  isScreen750to1440,
  isScreenSmallerThan1200,
}
