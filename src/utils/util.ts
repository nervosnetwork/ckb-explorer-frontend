import { CONFIRMATION_MAX } from './const'

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
  return value / 10 ** 8
}

export { copyElementValue, shannonToCkb }

export const formattorConfirmation = (confirmation: number | undefined) => {
  if (!confirmation) return '0 Confirmation'
  if (confirmation! > CONFIRMATION_MAX) {
    return `${CONFIRMATION_MAX}+ Confirmation`
  }
  return `${confirmation} Confirmation`
}
