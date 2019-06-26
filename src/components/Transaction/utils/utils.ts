import { parseNumber } from '../../../utils/number'
import { CONFIRMATION_MAX } from './const'

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
  if (!confirmation) return '0 Confirmation'
  if (confirmation! > CONFIRMATION_MAX) {
    return `${CONFIRMATION_MAX}+ Confirmation`
  }
  return `${confirmation} Confirmation`
}
