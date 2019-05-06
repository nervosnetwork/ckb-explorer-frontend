const copyDivValue = (component: any) => {
  if (component) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(component)
    selection.removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand('Copy')
  }
}

const validNumber = (value: any, defaultValue: number) => {
  if (typeof value !== 'string') {
    return defaultValue
  }
  return value ? parseInt(value, 10) : defaultValue
}

const shannonToCkb = (value: number) => {
  return Math.floor(value / 10 ** 4) / 10 ** 4
}

export { copyDivValue, validNumber, shannonToCkb }
