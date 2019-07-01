import { CONFIRMATION_MAX } from './const'
import { parseNumber } from './number'
import { Transaction } from '../http/response/Transaction'

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

export const getCapacityChange = (transaction: Transaction, address?: string) => {
  if (!transaction) return 0
  let capacity: number = 0
  transaction.display_inputs.forEach(element => {
    if (element.address_hash === address) {
      capacity -= parseNumber(element.capacity)
    }
  })
  transaction.display_outputs.forEach(element => {
    if (element.address_hash === address) {
      capacity += parseNumber(element.capacity)
    }
  })
  return capacity
}
