const copyElementValue = (component: any) => {
  if (component) {
    document.createRange().selectNodeContents(component)
    document.execCommand('Copy')
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

const shannonToCkb = (value: number) => {
  return Math.floor(value / 10 ** 4) / 10 ** 4
}

export { copyElementValue, validNumber, shannonToCkb, startEndEllipsis }
