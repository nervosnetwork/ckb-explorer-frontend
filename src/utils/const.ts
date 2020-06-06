import CONFIG from '../config'

export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const RESIZE_LATENCY = 500
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11
export const PAGE_CELL_COUNT = 200

export const MAINNET_PRIMARY_THEME_COLOR = '#3cc68a'
export const MAINNET_SECONDARY_THEME_COLOR = '#3cc68a'
export const TESTNET_PRIMARY_THEME_COLOR = '#617bbd'
export const TESTNET_SECONDARY_THEME_COLOR = '#85A1EA'

export const TOKEN_EMAIL_SUBJECT = 'Submit Token Info'
export const TOKEN_EMAIL_BODY = `
Title: Submit Token Information%0a%0d
Type Script:%0a%0d
    Code Hash:%0a%0d
    Hash Type:%0a%0d
    Args:%0a%0d

Information:%0a%0d
   Full Name: 32 length max%0a%0d
   Symbol: 8 length max / ASCII%0a%0d
   Decimal: 0~32%0a%0d
   Description:%0a%0d
   Website:%0a%0d
   Icon File: attachment (40 x 40)%0a%0d
   Other Info:%0a%0d

Note: Only accept sUDT information submission now.
`

export const HttpErrorCode = {
  NOT_FOUND_ADDRESS: 1010,
  ADDRESS_TYPE_ERROR: 1023,
}

export const SearchFailType = {
  CHAIN_ERROR: 'chain_error',
}

export const CachedKeys = {
  AppLanguage: `${CONFIG.CHAIN_TYPE}-AppLanguage`,
  APC: `${CONFIG.CHAIN_TYPE}-APC`,
  InflationRate: `${CONFIG.CHAIN_TYPE}-InflationRate`,
}

export enum CellState {
  NONE = 0,
  LOCK = 1,
  TYPE = 2,
  DATA = 3,
}

export enum CellType {
  Input = 'input',
  Output = 'output',
}

export enum DaoType {
  Normal = 'normal',
  Deposit = 'nervos_dao_deposit',
  Withdraw = 'nervos_dao_withdrawing',
  Udt = 'udt',
}

export enum DataType {
  LockScript = 'lock_script',
  TypeScript = 'type_script',
  Data = 'data',
}

export enum PageParams {
  PageNo = 1,
  PageSize = 10,
  MaxPageSize = 100,
}

export enum ListPageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}

export const ChartColors = ['#3182bd', '#66CC99']

export interface ContractHashTag {
  codeHash: string
  txHashes: string[] //  mainnet and testnet contract tx hash
  tag: string
  category: 'lock' | 'type'
}

export const ContractHashTags: ContractHashTag[] = [
  {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    txHashes: [
      '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c-0',
      '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37-0',
    ],
    tag: 'secp256k1_blake160',
    category: 'lock',
  },
  {
    codeHash: '0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8',
    txHashes: [
      '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c-1',
      '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37-1',
    ],
    tag: 'secp256k1 / multisig / locktime',
    category: 'lock',
  },
  {
    codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
    txHashes: ['0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c-0'],
    tag: 'secp256k1 / anyone-can-pay',
    category: 'lock',
  },
  {
    codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
    txHashes: [
      '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c-2',
      '0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f-2',
    ],
    tag: 'nervos dao',
    category: 'type',
  },
  {
    codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    txHashes: ['0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958-0'],
    tag: 'sudt',
    category: 'type',
  },
]
