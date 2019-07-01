import { Transaction, InputOutput } from '../http/response/Transaction'
import { MAX_CONFIRMATION } from './const'

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

const handleCellCapacity = (cells: InputOutput[], address?: string) => {
  if (!cells || cells.length === 0) return 0
  return cells
    .filter((cell: InputOutput) => cell.address_hash === address)
    .map((cell: InputOutput) => cell.capacity)
    .reduce((previous: number, current: number) => {
      return previous + current
    }, 0)
}

export const handleCapacityChange = (transaction: Transaction, address?: string) => {
  if (!transaction) return 0
  return (
    handleCellCapacity(transaction.display_outputs, address) - handleCellCapacity(transaction.display_inputs, address)
  )
}

export const formatConfirmation = (confirmation: number | undefined) => {
  if (!confirmation) {
    return '0 Confirmation'
  }
  return confirmation > MAX_CONFIRMATION ? `${MAX_CONFIRMATION}+ Confirmation` : `${confirmation} Confirmation`
}
