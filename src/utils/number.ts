export const parseNumber = (value: number | string, radix?: number) => {
  if (typeof value === 'string') {
    if (radix) {
      return Number.isNaN(parseInt(value, radix)) ? 0 : parseInt(value, radix)
    }
    return Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value)
  }
  if (!value) return 0
  return value
}

export const localeNumberString = (value: number | string, radix?: number) => {
  let text = parseNumber(value, radix).toString()
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

export const handleHashRate = (value: number) => {
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

export default {
  parseNumber,
  localeNumberString,
  handleHashRate,
}
