export const parsePageNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return parseInt(value, 10) || defaultValue
}

export const startEndEllipsis = (value: string, endLength = 8, startLength = 16) => {
  if (value === undefined || value === null) return ''
  if (value.length <= startLength) return value
  if (value.length <= startLength + endLength) return value
  return `${value.substr(0, startLength)}...${value.substr(value.length - endLength, endLength)}`
}

export const adaptMobileEllipsis = (value: string, length = 8) => {
  if (window.innerWidth <= 320) {
    return startEndEllipsis(value, length, length)
  }
  if (window.innerWidth < 700) {
    const step = (window.innerWidth - 320) / 15
    return startEndEllipsis(value, length + step, length + step)
  }
  return value
}

export const adaptPCEllipsis = (value: string, length = 8, factor = 40) => {
  if (window.innerWidth < 700) {
    return value
  }
  const width = window.innerWidth > 1200 ? 1200 : window.innerWidth
  const step = (width - 700) / factor
  return startEndEllipsis(value, length + step, length + step)
}

export const hexToUtf8 = (value: string) => {
  if (!value) return value
  const newValue = value.startsWith('0x') ? value.substring(2) : value
  try {
    return decodeURIComponent(newValue.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
  } catch (error) {
    return value
  }
}

export const addPrefixForHash = (value: string) => {
  if (value && value.length >= 32 && /\b[A-Fa-f0-9]+\b/.test(value)) {
    return `0x${value}`
  }
  return value
}
