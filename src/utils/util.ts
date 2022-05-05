import { ReactNode } from 'react'
import camelcaseKeys from 'camelcase-keys'
import BigNumber from 'bignumber.js'
import { scriptToAddress, addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { MAX_CONFIRMATION, TOKEN_EMAIL_SUBJECT, TOKEN_EMAIL_BODY, TOKEN_EMAIL_ADDRESS } from '../constants/common'
import { ContractHashTag, MainnetContractHashTags, TestnetContractHashTags } from '../constants/scripts'
import i18n from './i18n'
import { isMainnet } from './chain'
import CONFIG from '../config'

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

export const shannonToCkbDecimal = (value: BigNumber | string | number, decimal?: number) => {
  if (!value) return 0
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN()) {
    return 0
  }
  const num = bigValue.dividedBy(new BigNumber('1e8')).abs().toNumber()
  if (decimal) {
    if (bigValue.isNegative()) {
      return 0 - Math.floor(num * 10 ** decimal) / 10 ** decimal
    }
    return Math.floor(num * 10 ** decimal) / 10 ** decimal
  }
  if (bigValue.isNegative()) {
    return 0 - Math.floor(num)
  }
  return Math.floor(num)
}

export const shannonToCkb = (value: BigNumber | string | number): string => {
  if (!value) return '0'
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN()) {
    return '0'
  }
  const num = bigValue.dividedBy(new BigNumber('1e8'))
  if (num.abs().isLessThan(new BigNumber('1e-8'))) {
    return '0'
  }
  if (num.abs().isLessThan(new BigNumber('1e-6'))) {
    if (bigValue.mod(10).isEqualTo(0)) {
      return num.toFixed(7)
    }
    return num.toFixed(8)
  }
  return `${num}`
}

export const toCamelcase = <T>(object: any): T | null => {
  try {
    return JSON.parse(
      JSON.stringify(
        camelcaseKeys(object, {
          deep: true,
        }),
      ),
    ) as T
  } catch (error) {
    console.error(error)
  }
  return null
}

export const formatConfirmation = (confirmation: number) => {
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

export const baseUrl = () => {
  const mainnetUrl = `${CONFIG.MAINNET_URL}`
  const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`

  return isMainnet() ? mainnetUrl : testnetUrl
}

export const matchScript = (contractHash: string, hashType: string): ContractHashTag | undefined => {
  if (isMainnet()) {
    return MainnetContractHashTags.find(
      scriptTag => scriptTag.codeHashes.find(codeHash => codeHash === contractHash) && scriptTag.hashType === hashType,
    )
  }
  return TestnetContractHashTags.find(
    scriptTag => scriptTag.codeHashes.find(codeHash => codeHash === contractHash) && scriptTag.hashType === hashType,
  )
}

export const matchTxHash = (txHash: string, index: number | string): ContractHashTag | undefined => {
  if (isMainnet()) {
    return MainnetContractHashTags.find(codeHashTag => codeHashTag.txHashes.find(hash => hash === `${txHash}-${index}`))
  }
  return TestnetContractHashTags.find(codeHashTag => codeHashTag.txHashes.find(hash => hash === `${txHash}-${index}`))
}

export const udtSubmitEmail = () =>
  `mailto:${TOKEN_EMAIL_ADDRESS}?subject=${TOKEN_EMAIL_SUBJECT}&body=${TOKEN_EMAIL_BODY}`

export const getChainNames = (isHardforked: boolean) =>
  isHardforked
    ? {
        mainnet: 'mirana',
        testnet: 'pudge',
      }
    : {
        mainnet: 'lina',
        testnet: 'aggron',
      }

export const deprecatedAddrToNewAddr = (addr: string) => {
  if (!addr.startsWith('ck')) {
    return addr
  }
  try {
    return scriptToAddress(addressToScript(addr), addr.startsWith('ckb'))
  } catch {
    return addr
  }
}

export default {
  copyElementValue,
  shannonToCkb,
  toCamelcase,
  formatConfirmation,
  isValidReactNode,
  getChainNames,
  deprecatedAddrToNewAddr,
}
