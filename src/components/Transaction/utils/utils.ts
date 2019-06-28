import { parseNumber } from '../../../utils/number'
import { CONFIRMATION_MAX } from './const'
import i18n from '../../../utils/i18n'

export const getCapacityChange = (transaction: { display_inputs: [any]; display_outputs: [any] }, address?: string) => {
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

export const formattorConfirmation = (confirmation: number | undefined) => {
  if (!confirmation) return `0 ${i18n.t('details.confirmation')}`
  if (confirmation! > CONFIRMATION_MAX) {
    return `${CONFIRMATION_MAX}+ ${i18n.t('details.confirmation')}`
  }
  return `${confirmation} ${i18n.t('details.confirmation')}`
}
