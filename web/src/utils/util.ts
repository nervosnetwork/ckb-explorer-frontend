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

const shannonToCkb = (value: number) => {
  return Math.floor(value / 10 ** 4) / 10 ** 4
}

export { copyElementValue, shannonToCkb }
