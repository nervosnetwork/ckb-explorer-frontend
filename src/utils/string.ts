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

export const searchTextCorrection = (value: string) => {
  // Possible queries:
  //  block number  59003
  //  block hash    0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8
  //  tx hash       0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5
  //  lock hash     0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5
  //  address       ckt1q9gry5zg8u2h8dzzrr2vz253jxd932rrheq4527rxr7493

  if (!value) return value
  if (/\b(0[xX])/.test(value)) return value

  if (value.length === 64 && /\b[A-Fa-f0-9]+\b/.test(value)) {
    return `0x${value}`
  }
  return value
}
