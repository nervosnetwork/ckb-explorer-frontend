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

const validNumber = (value: string, defaultValue: number) => {
  return value ? parseInt(value as string, 10) : defaultValue
}

export { copyDivValue, validNumber }
