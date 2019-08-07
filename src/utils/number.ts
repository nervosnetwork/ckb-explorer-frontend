export const parseNumber = (value: number | string, radix?: number) => {
  if (typeof value === 'string') {
    if (radix) {
      return Number.isNaN(parseInt(value, radix)) ? 0 : parseInt(value, radix)
    }
    return Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value)
  }
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

export default {
  parseNumber,
  localeNumberString,
}
