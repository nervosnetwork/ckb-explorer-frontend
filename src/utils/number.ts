import BigNumber from 'bignumber.js'

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
  const exponent = new BigNumber(compact).dividedToIntegerBy(new BigNumber(2).pow(24))
  let mantissa = new BigNumber(compact).modulo(new BigNumber(2).pow(24))

  let target = new BigNumber(0)
  if (exponent.lte(new BigNumber(3))) {
    mantissa = mantissa.dividedToIntegerBy(
      new BigNumber(2).pow(new BigNumber(8).times(new BigNumber(3).minus(exponent))),
    )
    target = mantissa
  } else {
    target = mantissa
    target = target.times(new BigNumber(2).pow(new BigNumber(8).times(exponent.minus(new BigNumber(3)))))
  }

  const overflow = !mantissa.isZero() && exponent.gt(new BigNumber(32))
  return { target, overflow }
}

export function compactToDifficulty(compact: number) {
  const { target } = compactToTarget(compact)

  const u256MaxValue = new BigNumber(2).pow(256).minus(1)
  const hspace = new BigNumber('0x10000000000000000000000000000000000000000000000000000000000000000')

  if (target.isZero()) {
    return `0x${u256MaxValue.toString(16)}`
  }

  return `0x${hspace.dividedToIntegerBy(target).toString(16)}`
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

export const parseUDTAmount = (amount: string, decimal: string | number, format: boolean = true) => {
  try {
    const decimalInt = typeof decimal === 'string' ? parseInt(decimal, 10) : decimal
    const amountBigInt = new BigNumber(amount)
    if (amountBigInt.isNaN()) {
      return '0'
    }
    const result = amountBigInt.dividedBy(new BigNumber(10).pow(decimalInt))
    if (result.isNaN()) {
      return '0'
    }
    if (decimalInt > 20) {
      return `${result.toFixed(20)}...`
    }
    if (result.toString().length >= 16 || result.abs().lt(new BigNumber(0.000001))) {
      return format ? localeNumberString(result.toFixed(decimalInt)) : result.toFixed(decimalInt)
    }
    return format ? localeNumberString(result.toNumber()) : result.toString()
  } catch (error) {
    console.error(error)
    return '0'
  }
}

/**
 * Parse UDT amount without formatting (no commas)
 * @param amount - The raw amount string
 * @param decimal - The decimal places
 * @returns Unformatted numeric string
 */
export const parseUDTAmountRaw = (amount: string, decimal: string | number) => {
  return parseUDTAmount(amount, decimal, false)
}

export function isValidNoNegativeInteger(input: string | number | undefined) {
  if (!input) return false
  const number = Number(input)
  return !Number.isNaN(number) && Number.isInteger(number) && number >= 0
}

export function numberToOrdinal(number: number, showText = false) {
  if (showText) {
    switch (number) {
      case 1:
        return 'first'
      case 2:
        return 'second'
      default:
        break
    }
  }

  switch (number % 10) {
    case 1:
      return `${number}st`
    case 2:
      return `${number}nd`
    case 3:
      return `${number}rd`
    default:
      return `${number}th`
  }
}
