import BigNumber from 'bignumber.js'

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
    if (result.toString().length >= 16 || result.lt(new BigNumber(0.000001))) {
      return localeNumberString(result.toFixed(decimalInt))
    }
    return localeNumberString(result.toNumber())
  } catch (error) {
    console.error(error)
    return '0'
  }
}
