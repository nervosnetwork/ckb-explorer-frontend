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

export { copyDivValue, validNumber }
