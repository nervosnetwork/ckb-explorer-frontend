const copyElementValue = (component: any) => {
  if (component) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(component)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('Copy')
    selection.removeAllRanges()
  }
}

const validNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return value ? parseInt(value, 10) : defaultValue
}

const startEndEllipsis = (value: string, length = 8 ) => {
  if (value === undefined || value === null) return ''
  return `${value.substr(0, 16)}...${value.substr(value.length - length, length)}`
}

const hexToUtf8 = (value: string) => {
  return value? decodeURIComponent(value.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&')) : value
}

const shannonToCkb = (value: number) => {
  return Math.floor(value / 10 ** 4) / 10 ** 4
}

export { copyElementValue, validNumber, shannonToCkb, startEndEllipsis, hexToUtf8 }
