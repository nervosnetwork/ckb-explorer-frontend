import { ReactNode } from 'react'
import camelcaseKeys from 'camelcase-keys'
import { MAX_CONFIRMATION } from './const'
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

export const toCamelcase = <T>(object: any): T => {
  return JSON.parse(
    JSON.stringify(
      camelcaseKeys(object, {
        deep: true,
      }),
    ),
  ) as T
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

export default {
  copyElementValue,
  shannonToCkb,
  toCamelcase,
  formatConfirmation,
  isValidReactNode,
}
