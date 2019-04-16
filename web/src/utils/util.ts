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

export default copyDivValue
