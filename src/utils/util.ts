import { Transaction, InputOutput } from '../service/response/Transaction'
import { MAX_CONFIRMATION } from './const'
import i18n from './i18n'
import { parseNumber } from './number'

export const copyElementValue = (component: any) => {
  if (!component) return
  const selection = window.getSelection()
  if (selection) {
    const range = document.createRange()
    range.selectNodeContents(component)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('Copy')
    selection.removeAllRanges()
  }
}

export const shannonToCkb = (value: number) => {
  return value / 10 ** 8
}

const handleCellCapacity = (cells: InputOutput[], address?: string) => {
  if (!cells || cells.length === 0) return 0
  return cells
    .filter((cell: InputOutput) => cell.address_hash === address)
    .map((cell: InputOutput) => parseNumber(cell.capacity))
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
  if (!confirmation || confirmation < 0) {
    return ``
  }
  if (confirmation > MAX_CONFIRMATION) {
    return `${MAX_CONFIRMATION}+ ${i18n.t('address.confirmations')}`
  }
  if (confirmation > 1) {
    return `${confirmation} ${i18n.t('address.confirmations')}`
  }
  return `${confirmation} ${i18n.t('address.confirmation')}`
}

export default {
  copyElementValue,
  shannonToCkb,
  handleCapacityChange,
  formatConfirmation,
}
