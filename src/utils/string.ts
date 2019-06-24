export const validNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return value ? parseInt(value, 10) : defaultValue
}

export const startEndEllipsis = (value: string, length = 8) => {
  if (value === undefined || value === null) return ''
  if (value.length <= 16) return value
  return `${value.substr(0, 16)}...${value.substr(value.length - length, length)}`
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

export const hexToUtf8 = (value: string) => {
  if (!value) return value
  const newValue = value.startsWith('0x') ? value.substring(2) : value
  try {
    return decodeURIComponent(newValue.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
  } catch (error) {
    return value
  }
}

export const prefixHex = (value: string) => {
  if (!value) return value
  if (/\b(0[xX])/.test(value)) return value

  if (/\b[A-Fa-f0-9]+\b/.test(value)) {
    return `0x${value}`
  }
  return value
}
