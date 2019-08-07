import { ReactNode } from 'react'
import { MAX_CONFIRMATION, SearchSuggestionType } from './const'
import i18n from './i18n'

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

export const isValidReactNode = (node: ReactNode) => {
  if (node instanceof Array) {
    return node.findIndex(item => !!item) > -1
  }
  return !!node
}

export const generateBlockHeightSuggestions = (n: number, maxBlockHeight: number) => {
  const possibleBlockHeights = []
  if (n <= maxBlockHeight) {
    possibleBlockHeights.push({
      value: n.toString(),
      path: `/block/${n}`,
      type: SearchSuggestionType.BlockHeight,
    })
  }

  for (let i = 0; i <= 9; i++) {
    const possibleBlockHeight = n * 10 + i
    if (possibleBlockHeight <= maxBlockHeight) {
      possibleBlockHeights.push({
        value: possibleBlockHeight.toString(),
        path: `/block/${possibleBlockHeight}`,
        type: SearchSuggestionType.BlockHeight,
      })
    }
  }

  return possibleBlockHeights
}

export const generateTransactionSuggestion = (tx: string) => ({
  value: tx,
  path: `/transaction/${tx}`,
  type: SearchSuggestionType.Transaction,
})

export const generateAddressSuggestion = (address: string, balance: number) => ({
  value: address,
  balance,
  path: `/address/${address}`,
  type: SearchSuggestionType.Address,
})

export const generateLockHashSuggestion = (hash: string) => ({
  value: hash,
  path: `/address/${hash}`,
  type: SearchSuggestionType.LockHash,
})

export const generateBlockHashSuggestion = (hash: string) => ({
  value: hash,
  path: `/block/${hash}`,
  type: SearchSuggestionType.BlockHash,
})

export default {
  copyElementValue,
  shannonToCkb,
  formatConfirmation,
  isValidReactNode,
  generateBlockHeightSuggestions,
  generateTransactionSuggestion,
  generateAddressSuggestion,
  generateLockHashSuggestion,
}
