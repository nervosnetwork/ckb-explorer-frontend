export const parsePageNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return parseInt(value, 10) || defaultValue
}

export const startEndEllipsis = (value: string, endLength = 8, startLength = 16) => {
  if (value === undefined || value === null) return ''
  if (value.length <= startLength) return value
  return `${value.substr(0, startLength)}...${value.substr(value.length - endLength, endLength)}`
}

export const parseLongAddressHash = (address: string) => {
  if (address) {
    if (address.length <= 50) {
      return address
    }
    return `${address.substr(0, 25)}...${address.substr(address.length - 22, 22)}`
  }
  return ''
}

export const parseLongAddressHashMobile = (address: string) => {
  if (address.length <= 30) {
    return address
  }

  return `${address.slice(0, 8)}...${address.slice(address.length - 8, address.length)}`
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
