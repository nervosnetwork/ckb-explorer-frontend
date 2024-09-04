import BigNumber from 'bignumber.js'
import { BI } from '@ckb-lumos/bi'

export function isNumeric(str: string) {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str))
}

const BLOCK_HASH_LENGTH = 64

export function isBlockNumber(str: string) {
  if (str.length >= BLOCK_HASH_LENGTH) return false

  if (!Number.isNaN(str) && !Number.isNaN(parseFloat(str)) && parseFloat(str) !== 0) {
    return true
  }

  return !Number.isNaN(str) && !Number.isNaN(parseInt(str, 16)) && parseInt(str, 16) !== 0
}

export const localeNumberString = (value: BigNumber | string | number): string => {
  if (!value) return '0'
  const origin = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  const bigValue = origin.abs()
  if (bigValue.isNaN()) {
    return '0'
  }
  if (bigValue.isLessThan(1) && bigValue.abs().isGreaterThan(0)) {
    return `${value}`
  }
  let text = bigValue.toString(10)
  const pointIndex = text.indexOf('.')
  let offset = pointIndex === -1 ? text.length : pointIndex
  while (offset > 3) {
    text = text
      .slice(0, offset - 3)
      .concat(',')
      .concat(text.slice(offset - 3))
    offset -= 3
  }
  return origin.isNegative() ? `-${text}` : text
}

// reference: https://github.com/nervosnetwork/ckb/wiki/Header-%C2%BB-compact_target
function compactToTarget(compact: number) {
  const exponent = BI.from(compact).shr(BI.from(24))
  let mantissa = BI.from(compact).and(BI.from(0x00ff_ffff))

  let target = BI.from(0)
  if (exponent.lte(BI.from(3))) {
    mantissa = mantissa.shr(BI.from(8).mul(BI.from(3).sub(exponent)))
    target = mantissa
  } else {
    target = mantissa
    target = target.shl(BI.from(8).mul(exponent.sub(BI.from(3))))
  }

  const overflow = !mantissa.isZero() && exponent.gt(BI.from(32))
  return { target, overflow }
}

export function compactToDifficulty(compact: number) {
  const { target } = compactToTarget(compact)

  const u256MaxValue = BI.from(2).pow(256).sub(1)
  const hspace = BI.from('0x10000000000000000000000000000000000000000000000000000000000000000')

  if (target.isZero()) {
    return u256MaxValue.toHexString()
  }

  return hspace.div(target).toHexString()
}

const MIN_VALUE = new BigNumber(1)
export const handleDifficulty = (value: BigNumber | string | number) => {
  if (!value) return '0'
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  const kv = bigValue.dividedBy(1000)
  const mv = kv.dividedBy(1000)
  const gv = mv.dividedBy(1000)
  const tv = gv.dividedBy(1000)
  const pv = tv.dividedBy(1000)
  const ev = pv.dividedBy(1000)
  const zv = ev.dividedBy(1000)
  const yv = zv.dividedBy(1000)

  if (yv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(yv.toFixed(2))} YH`
  }
  if (zv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(zv.toFixed(2))} ZH`
  }
  if (ev.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(ev.toFixed(2))} EH`
  }
  if (pv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(pv.toFixed(2))} PH`
  }
  if (tv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(tv.toFixed(2))} TH`
  }
  if (gv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(gv.toFixed(2))} GH`
  }
  if (mv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(mv.toFixed(2))} MH`
  }
  if (kv.isGreaterThanOrEqualTo(MIN_VALUE)) {
    return `${localeNumberString(kv.toFixed(2))} KH`
  }
  return `${localeNumberString(bigValue.toFixed(2))} H`
}

export const handleHashRate = (value: BigNumber | string | number) => {
  return `${handleDifficulty(value)}/s`
}

export const parseCKBAmount = (capacity: string) => {
  return parseUDTAmount(capacity, 8)
}

export const parseUDTAmount = (amount: string, decimal: string | number) => {
  try {
    const decimalInt = typeof decimal === 'string' ? parseInt(decimal, 10) : decimal
    const amountBigInt = new BigNumber(amount)
    const result = amountBigInt.dividedBy(new BigNumber(10).pow(decimalInt))
    if (decimalInt > 20) {
      return `${result.toFixed(20)}...`
    }
    if (result.toString().length >= 16 || result.abs().lt(new BigNumber(0.000001))) {
      return localeNumberString(result.toFixed(decimalInt))
    }
    return localeNumberString(result.toNumber())
  } catch (error) {
    console.error(error)
    return '0'
  }
}

export function isValidNoNegativeInteger(input: string | number | undefined) {
  if (!input) return false
  const number = Number(input)
  return !Number.isNaN(number) && Number.isInteger(number) && number >= 0
}
