import BigNumber from 'bignumber.js'

export const localeNumberString = (value: BigNumber | string | number): string => {
  const originValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (originValue.abs().isLessThan(1) && originValue.abs().isGreaterThan(0)) return `${value}`
  let text = originValue.isNaN() ? '0' : originValue.toString(10)
  const pointIndex = text.indexOf('.')
  let offset = pointIndex === -1 ? text.length : pointIndex
  while (offset > 3) {
    text = text
      .slice(0, offset - 3)
      .concat(',')
      .concat(text.slice(offset - 3))
    offset -= 3
  }
  return text
}

const MIN_VALUE = new BigNumber(10 ** 3)
export const handleDifficulty = (value: BigNumber | string | number) => {
  const originValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  const kv = originValue.dividedBy(1000)
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
  return `${localeNumberString(originValue.toFixed(2))} H`
}

export const handleHashRate = (value: BigNumber | string | number) => {
  return `${handleDifficulty(value)}/s`
}

export default {
  localeNumberString,
  handleDifficulty,
  handleHashRate,
}
