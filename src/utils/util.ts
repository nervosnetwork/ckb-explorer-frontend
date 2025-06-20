import { ReactNode, SyntheticEvent } from 'react'
import camelcaseKeys from 'camelcase-keys'
import JSBI from 'jsbi'
import BigNumber from 'bignumber.js'
import { scriptToAddress, addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { useTranslation } from 'react-i18next'
import { HashType } from '@ckb-lumos/base'
import {
  MAX_CONFIRMATION,
  TOKEN_EMAIL_SUBJECT,
  TOKEN_EMAIL_BODY,
  TOKEN_EMAIL_ADDRESS,
  IS_MAINNET,
} from '../constants/common'
import {
  ContractHashTag,
  MainnetContractHashTags,
  ScriptTagExtraRules,
  TestnetContractHashTags,
} from '../constants/scripts'
import { isMainnet } from './chain'
import { Script } from '../models/Script'
import { Cell } from '../models/Cell'
import { parseBtcTimeLockArgs } from './rgbpp'
import FtFallbackIcon from '../assets/ft_fallback_icon.png'

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

export const toCamelcase = <T>(object: any): T => {
  return JSON.parse(
    JSON.stringify(
      camelcaseKeys(object, {
        deep: true,
      }),
    ),
  ) as T
}
type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Uppercase<T> ? '_' : ''}${Lowercase<T>}${SnakeCase<U>}`
  : S

type ToSnakeCaseKeys<T> = T extends object
  ? {
      [K in keyof T as SnakeCase<string & K>]: T[K] extends object ? ToSnakeCaseKeys<T[K]> : T[K]
    }
  : T

export function toSnakeCase<T>(obj: T): ToSnakeCaseKeys<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as ToSnakeCaseKeys<T>
  }

  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item)) as ToSnakeCaseKeys<T>
  }

  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
      result[snakeKey] = toSnakeCase(obj[key])
    }
  }

  return result as ToSnakeCaseKeys<T>
}

export const useFormatConfirmation = () => {
  const { t } = useTranslation()
  return (confirmation: number) => {
    if (confirmation > MAX_CONFIRMATION) {
      return `${MAX_CONFIRMATION}+ ${t('address.confirmations')}`
    }
    if (confirmation > 1) {
      return `${confirmation} ${t('address.confirmations')}`
    }
    return `${confirmation} ${t('address.confirmation')}`
  }
}

export const isValidReactNode = (node: ReactNode) => {
  if (node instanceof Array) {
    return node.findIndex(item => !!item) > -1
  }
  return !!node
}

export const getContractHashTag = (script: Script, ignoreHashType = false): ContractHashTag | undefined => {
  if (!script.codeHash || !script.hashType) return undefined
  const contractHashTag = matchScript(script.codeHash, ignoreHashType ? undefined : script.hashType)
  if (!!contractHashTag && ScriptTagExtraRules.has(contractHashTag.tag)) {
    return {
      ...contractHashTag,
      tag: ScriptTagExtraRules.get(contractHashTag.tag)?.(script as Script) || contractHashTag.tag,
    }
  }
  return contractHashTag
}

export const matchScript = (contractHash: string, hashType?: string): ContractHashTag | undefined => {
  if (isMainnet()) {
    return MainnetContractHashTags.find(
      scriptTag =>
        scriptTag.codeHashes.find(codeHash => codeHash === contractHash) &&
        (!hashType || scriptTag.hashType === hashType),
    )
  }
  return TestnetContractHashTags.find(
    scriptTag =>
      scriptTag.codeHashes.find(codeHash => codeHash === contractHash) &&
      (!hashType || scriptTag.hashType === hashType),
  )
}

export const matchTxHash = (txHash: string, index: number | string): ContractHashTag | undefined => {
  if (isMainnet()) {
    return MainnetContractHashTags.find(codeHashTag => codeHashTag.txHashes.find(hash => hash === `${txHash}-${index}`))
  }
  return TestnetContractHashTags.find(codeHashTag => codeHashTag.txHashes.find(hash => hash === `${txHash}-${index}`))
}

// return txid and index of btc utxo, in hex string without 0x
export const getBtcUtxo = (script: Script) => {
  const scriptSet = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags

  // FIXME: should not use tag as index
  const INDEX_TAG = 'RGB++'
  const rgbppScript = scriptSet.find(s => s.tag === INDEX_TAG)
  if (!rgbppScript) return
  if (rgbppScript.hashType !== script.hashType || !rgbppScript.codeHashes.includes(script.codeHash)) return
  const INDEX_BYTE_SIZE = 4
  const TXID_BYTE_SIZE = 32
  const d = 2 * INDEX_BYTE_SIZE + 2
  const [index, txid] = [script.args.slice(2, d), script.args.slice(d, d + TXID_BYTE_SIZE * 2)].map(v =>
    v.match(/\w{2}/g)?.reverse().join(''),
  )
  return { txid, index }
}

export const getBtcTimeLockInfo = (script: Script) => {
  const scriptSet = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags

  // FIXME: should not use tag as index
  const INDEX_TAG = 'BTC Time Lock'
  const btcTimeLockScript = scriptSet.find(s => s.tag === INDEX_TAG)
  if (!btcTimeLockScript) return
  if (btcTimeLockScript.hashType !== script.hashType || !btcTimeLockScript.codeHashes.includes(script.codeHash)) return
  try {
    return parseBtcTimeLockArgs(script.args)
  } catch (e) {
    return null
  }
}

export const udtSubmitEmail = () =>
  `mailto:${TOKEN_EMAIL_ADDRESS}?subject=${TOKEN_EMAIL_SUBJECT}&body=${TOKEN_EMAIL_BODY}`

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

export const handleRedirectFromAggron = () => {
  const PREV_TESTNAME = 'aggron'
  const CURRENT_TESTNET = 'pudge'
  const testnetNameRegexp = new RegExp(`^/(${PREV_TESTNAME}|${CURRENT_TESTNET})`)
  if (testnetNameRegexp.test(window.location.pathname)) {
    const redirect = `${window.location.protocol}//${CURRENT_TESTNET}.${
      window.location.host
    }${window.location.pathname.replace(testnetNameRegexp, '')}`
    window.location.href = redirect
    return true
  }
  return false
}

export const handleNftImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget
  const { assetType } = img.dataset
  if (assetType === 'DOB') {
    e.currentTarget.src = '/images/spore_placeholder.svg'
    return
  }
  e.currentTarget.src = '/images/nft_placeholder.png'
}

export const handleFtImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = FtFallbackIcon
}

export const patchMibaoImg = (url: string) => {
  const JINSE_ORIGIN = 'https://oss.jinse.cc'
  const NERVINA_ORIGIN = 'https://goldenlegend.oss-accelerate.aliyuncs.com'
  const MAD_ORIGIN = 'https://mad-api.nervina.cn'

  const NEW_MIBAO_ORIGIN = 'https://nft-box.s3.amazonaws.com'
  const NEW_MAD_ORIGIN = 'https://mad.digitalcompound.org'

  try {
    const u = new URL(url)
    if ([JINSE_ORIGIN, NERVINA_ORIGIN].includes(u.origin)) {
      return `${NEW_MIBAO_ORIGIN}${u.pathname}`
    }

    if ([MAD_ORIGIN].includes(u.origin)) {
      return `${NEW_MAD_ORIGIN}${u.pathname}`
    }

    return url
  } catch {
    return url
  }
}

/**
 *@link https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md#specification
 */
export const parseSince = (
  since: string,
): { base: 'absolute' | 'relative'; type: 'block' | 'epoch' | 'timestamp'; value: string } | null => {
  const s = JSBI.BigInt(since)
  if (JSBI.equal(s, JSBI.BigInt(0))) {
    return null
  }

  const relativeFlag = JSBI.signedRightShift(s, JSBI.BigInt(63))
  const metricFlag = JSBI.bitwiseAnd(JSBI.signedRightShift(s, JSBI.BigInt(61)), JSBI.BigInt(3))

  const value = JSBI.bitwiseAnd(s, JSBI.BigInt('0xffffffffffffff'))

  const base = relativeFlag.toString() === '0' ? 'absolute' : 'relative'

  switch (metricFlag.toString()) {
    case '0': {
      // use block number
      return {
        base,
        type: 'block',
        value: JSBI.add(value, JSBI.BigInt(1)).toString(),
      }
    }
    case '1': {
      // use epoch number with fraction
      const EFigures = JSBI.BigInt(0xffffff)
      const IFigures = JSBI.BigInt(0xffff)
      const LFigures = JSBI.BigInt(0xffff)
      const E = +JSBI.bitwiseAnd(s, EFigures)
      const I = +JSBI.bitwiseAnd(JSBI.signedRightShift(s, JSBI.BigInt(24)), IFigures)
      const L = +JSBI.bitwiseAnd(JSBI.signedRightShift(s, JSBI.BigInt(40)), LFigures)
      return {
        base,
        type: 'epoch',
        value: L ? `${(E + (I + 1) / L).toFixed(2)}` : `${E}`,
      }
    }
    case '2': {
      // use median_timestamp
      return {
        base,
        type: 'timestamp',
        value: value.toString(),
      }
    }
    default: {
      throw new Error('invalid since')
    }
  }
}

export function singleton<Fn extends (...args: any) => Promise<any>>(fn: Fn): Fn {
  let latestPromise: Promise<unknown> | null = null

  // eslint-disable-next-line func-names
  return function (this: unknown, ...args) {
    if (latestPromise) return latestPromise

    const promise = fn.apply(this, args)
    promise.finally(() => {
      if (promise === latestPromise) {
        latestPromise = null
      }
    })

    latestPromise = promise
    return promise
  } as Fn
}

export function sleep(time: number) {
  return new Promise<void>(resolve => setTimeout(resolve, time))
}

export const isDeepEqual = (left: any, right: any, ignoredKeys?: string[]): boolean => {
  const equal = (a: any, b: any): boolean => {
    if (a === b) return true

    if (a && b && typeof a === 'object' && typeof b === 'object') {
      if (a.constructor !== b.constructor) return false

      let length
      let i
      if (Array.isArray(a)) {
        length = a.length
        if (length !== b.length) return false
        for (i = length; i-- !== 0; ) {
          if (!equal(a[i], b[i])) return false
        }
        return true
      }

      if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false
        for (i of a.entries()) {
          if (!b.has(i[0])) return false
        }
        for (i of a.entries()) {
          if (!equal(i[1], b.get(i[0]))) return false
        }
        return true
      }

      if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false
        for (i of a.entries()) if (!b.has(i[0])) return false
        return true
      }

      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf()
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString()

      const keys = Object.keys(a)
      length = keys.length
      if (length !== Object.keys(b).length) return false

      for (i = length; i-- !== 0; ) {
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
      }

      for (i = length; i-- !== 0; ) {
        const key = keys[i]

        if (key === '_owner' && a.$$typeof) {
          // React
          continue
        }

        if (ignoredKeys && ignoredKeys.includes(key)) {
          continue
        }

        if (!equal(a[key], b[key])) return false
      }

      return true
    }
    // eslint-disable-next-line no-self-compare
    return a !== a && b !== b
  }
  return equal(left, right)
}

export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export const isDaoDepositCell = (cellType: Cell['cellType']) => cellType === 'nervos_dao_deposit'

export const isDaoWithdrawCell = (cellType: Cell['cellType']) => cellType === 'nervos_dao_withdrawing'

export const isDaoCell = (cellType: Cell['cellType']) => isDaoDepositCell(cellType) || isDaoWithdrawCell(cellType)

export const isTransactionHash = (hash: string) => {
  return /^0x([0-9a-fA-F]{64})$/.test(hash)
}

export const isNumber = (value: string) => {
  return /^\d+$/.test(value)
}

export function assertIsHashType(value: string): asserts value is HashType {
  if (value !== 'type' && value !== 'data' && value !== 'data1' && value !== 'data2') {
    throw new Error(`Value is expected to be type/data/data1/data2, but got  ${value}`)
  }
}

export const formatNftDisplayId = (id: string, type: string | null) => {
  switch (type) {
    case 'spore': {
      return `0x${BigNumber(id).toString(16).padStart(64, '0')}`
    }
    default: {
      return id
    }
  }
}

export const hexToBase64 = (hexstring: string) => {
  const str = hexstring
    .match(/\w{2}/g)
    ?.map(a => {
      return String.fromCharCode(parseInt(a, 16))
    })
    .join('')
  if (!str) return ''
  return btoa(str)
}

export const ckbToShannon = (amount: string = '0') => {
  if (Number.isNaN(+amount)) {
    return `${amount} ckb`
  }
  const [integer = '0', decimal = ''] = amount.split('.')
  const decimalLength = 10 ** decimal.length
  const num = integer + decimal

  return (BigInt(num) * BigInt(1e8 / decimalLength)).toString()
}

export default {
  shannonToCkb,
  toCamelcase,
  useFormatConfirmation,
  isValidReactNode,
  deprecatedAddrToNewAddr,
  handleRedirectFromAggron,
  assertIsHashType,
  formatNftDisplayId,
  hexToBase64,
}
