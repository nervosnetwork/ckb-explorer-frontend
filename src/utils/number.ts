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

const MIN_VALUE = 10 ** 3
export const handleDifficulty = (value: number) => {
  const kv = value / 1000
  const mv = kv / 1000
  const gv = mv / 1000
  const tv = gv / 1000
  const pv = tv / 1000
  const ev = pv / 1000
  const zv = ev / 1000
  const yv = zv / 1000

  if (yv >= MIN_VALUE) {
    return `${localeNumberString(yv.toFixed(2))} YH`
  }
  if (zv >= MIN_VALUE) {
    return `${localeNumberString(zv.toFixed(2))} ZH`
  }
  if (ev >= MIN_VALUE) {
    return `${localeNumberString(ev.toFixed(2))} EH`
  }
  if (pv >= MIN_VALUE) {
    return `${localeNumberString(pv.toFixed(2))} PH`
  }
  if (tv >= MIN_VALUE) {
    return `${localeNumberString(tv.toFixed(2))} TH`
  }
  if (gv >= MIN_VALUE) {
    return `${localeNumberString(gv.toFixed(2))} GH`
  }
  if (mv >= MIN_VALUE) {
    return `${localeNumberString(mv.toFixed(2))} MH`
  }
  if (kv >= MIN_VALUE) {
    return `${localeNumberString(kv.toFixed(2))} KH`
  }
  return `${localeNumberString(value.toFixed(2))} H`
}

export const handleHashRate = (value: number) => {
  return `${handleDifficulty(value)}/s`
}

export default {
  parseNumber,
  localeNumberString,
  handleDifficulty,
  handleHashRate,
}
