import { stringInsert } from './string'

export const parseHashRate = (value: number) => {
  const kv = value / 1000
  const mv = kv / 1000
  const gv = mv / 1000
  const tv = gv / 1000
  const pv = tv / 1000
  const ev = pv / 1000

  if (ev >= 1) {
    return `${ev.toFixed(2)} EH/s`
  }
  if (pv >= 1) {
    return `${pv.toFixed(2)} PH/s`
  }
  if (tv >= 1) {
    return `${tv.toFixed(2)} TH/s`
  }
  if (gv >= 1) {
    return `${gv.toFixed(2)} GH/s`
  }
  if (mv >= 1) {
    return `${mv.toFixed(2)} MH/s`
  }
  if (kv >= 1) {
    return `${kv.toFixed(2)} KH/s`
  }
  return `${value.toFixed(2)} H/s`
}

export const parseNumber = (value: any, radix?: number) => {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    if (radix) {
      return parseInt(value, radix)
    }
    return parseFloat(value)
  }
  return NaN
}

export const localeNumberString = (value: any, radix?: number) => {
  let text = parseNumber(value, radix).toString()
  if (text === 'NaN') return text
  const pointIndex = text.indexOf('.')
  let offset = pointIndex === -1 ? text.length : pointIndex
  while (offset > 3) {
    text = stringInsert(text, offset - 3, ',')
    offset -= 3
  }
  return text
}

export default {
  parseHashRate,
}
