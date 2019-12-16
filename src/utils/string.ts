import BigNumber from 'bignumber.js'

export const parsePageNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return parseInt(value, 10) || defaultValue
}

export const startEndEllipsis = (value: string, endLength = 8, startLength = 16) => {
  if (value === undefined || value === null) return ''
  if (endLength < 0 || startLength < 0) return value
  if (value.length <= startLength + endLength) return value
  return `${value.substr(0, startLength)}...${value.substr(value.length - endLength, endLength)}`
}

export const adaptMobileEllipsis = (value: string, length = 8) => {
  if (window.innerWidth <= 320) {
    return startEndEllipsis(value, length, length)
  }
  if (window.innerWidth < 700) {
    const step = Math.ceil((window.innerWidth - 320) / 15)
    return startEndEllipsis(value, length + step, length + step)
  }
  return value
}

export const adaptPCEllipsis = (value: string, length = 8, factor = 40) => {
  if (window.innerWidth < 700) {
    return value
  }
  const width = window.innerWidth > 1200 ? 1200 : window.innerWidth
  const step = Math.ceil((width - 700) / factor)
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

export const handleBigNumber = (value: BigNumber | string | number, decimal?: number) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN() || bigValue.isZero()) return '0'
  const kv = bigValue.dividedBy(1000)
  const mv = kv.dividedBy(1000)
  const gv = mv.dividedBy(1000)
  const tv = gv.dividedBy(1000)
  const pv = tv.dividedBy(1000)
  const ev = pv.dividedBy(1000)
  const zv = ev.dividedBy(1000)
  const yv = zv.dividedBy(1000)

  if (yv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? yv.toFixed(decimal) : yv.toFixed()}Y`
  }
  if (zv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? zv.toFixed(decimal) : zv.toFixed()}Z`
  }
  if (ev.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? ev.toFixed(decimal) : ev.toFixed()}E`
  }
  if (pv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? pv.toFixed(decimal) : pv.toFixed()}P`
  }
  if (tv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? tv.toFixed(decimal) : tv.toFixed()}T`
  }
  if (gv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? gv.toFixed(decimal) : gv.toFixed()}G`
  }
  if (mv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? mv.toFixed(decimal) : mv.toFixed()}M`
  }
  if (kv.isGreaterThanOrEqualTo(1)) {
    return `${decimal ? kv.toFixed(decimal) : kv.toFixed()}K`
  }
  return `${decimal ? bigValue.toFixed(decimal) : bigValue.toFixed()}`
}
