import BigNumber from 'bignumber.js'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { assert } from './error'

export function createTextMeasurer(element: HTMLElement): CanvasText['measureText'] {
  const style = window.getComputedStyle(element)
  const ctx = document.createElement('canvas').getContext('2d')
  assert(ctx)
  ctx.font = style.font ? style.font : `${style.fontSize} ${style.fontFamily}`
  return text => ctx.measureText(text)
}

export function createTextWidthMeasurer(element: HTMLElement): (text: string) => number {
  const measureText = createTextMeasurer(element)

  const charLMetrics = measureText('l')
  const charMMetrics = measureText('m')
  const isMonospace = charLMetrics.width === charMMetrics.width
  if (isMonospace) {
    return text => charLMetrics.width * text.length
  }

  return text => measureText(text).width
}

export const startEndEllipsis = (value: string, endLength = 8, startLength = 16) => {
  if (value === undefined || value === null) return ''
  if (endLength < 0 || startLength < 0) return value
  if (value.length <= startLength + endLength) return value
  return `${value.substr(0, startLength)}...${value.substr(value.length - endLength, endLength)}`
}

export const hexToUtf8 = (value: string = '') => {
  try {
    return new TextDecoder().decode(hexToBytes(value))
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

export const containSpecialChar = (value: string) => {
  const regEn = /[`~!@#$%^&*()_+<>?:"{}.;'[\]]/im
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
  return regEn.test(value) || regCn.test(value)
}

export const handleBigNumber = (value: BigNumber | string | number | null | undefined, decimal?: number) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (!bigValue || bigValue.isNaN() || bigValue.isZero()) return '0'
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

export const parseFloorDecimal = (value: BigNumber | string | number, decimal?: number) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN() || bigValue.isZero()) return '0'
  if (decimal) {
    if (bigValue.isNegative()) {
      return 0 - Math.floor(bigValue.abs().toNumber() * 10 ** decimal) / 10 ** decimal
    }
    return Math.floor(bigValue.abs().toNumber() * 10 ** decimal) / 10 ** decimal
  }
  if (bigValue.isNegative()) {
    return 0 - Math.floor(bigValue.abs().toNumber())
  }
  return Math.floor(bigValue.abs().toNumber())
}

export const handleBigNumberFloor = (value: BigNumber | string | number, decimal?: number) => {
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

  if (yv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(yv, decimal)}Y`
  }
  if (zv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(zv, decimal)}Z`
  }
  if (ev.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(ev, decimal)}E`
  }
  if (pv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(pv, decimal)}P`
  }
  if (tv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(tv, decimal)}T`
  }
  if (gv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(gv, decimal)}G`
  }
  if (mv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(mv, decimal)}M`
  }
  if (kv.abs().isGreaterThanOrEqualTo(1)) {
    return `${parseFloorDecimal(kv, decimal)}K`
  }
  return `${parseFloorDecimal(bigValue, decimal)}`
}

export const sliceNftName = (name?: string) => (name && name.length > 32 ? `${name.slice(0, 32)}...` : name)

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
