import { isMainnet } from '../utils/chain'
import config from '../config'

export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const FLUSH_CHART_CACHE_POLLING_TIME = 300000 // 5 minutes
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11
export const PAGE_CELL_COUNT = 200
export const NEXT_HARD_FORK_EPOCH = 5414
export const EPOCH_HOURS = 4
export const ONE_DAY_SECOND = 24 * 60 * 60
export const ONE_HOUR_SECOND = 60 * 60
export const ONE_MINUTE_SECOND = 60
export const EPOCHS_PER_HALVING = 8760
export const THEORETICAL_EPOCH_TIME = 1000 * 60 * 60 * 4 // 4 hours
export const IS_MAINTAINING = process.env.REACT_APP_IS_MAINTAINING === 'true'

export function getPrimaryColor() {
  return isMainnet() ? '#00CC9B' : '#9A2CEC'
}

export function getSecondaryColor() {
  return isMainnet() ? '#00CC9B' : '#9A2CEC'
}

export const TOKEN_EMAIL_ADDRESS = 'ckb-explorer@nervosnet.com'
export const TOKEN_EMAIL_SUBJECT = 'Submit Token Info'
export const TOKEN_EMAIL_BODY = `
Title: Submit Token Information%0a%0d
---------- Submit sUDT Token Information ----------%0a%0d

Type Script:%0a%0d
    Code Hash:%0a%0d
    Hash Type:%0a%0d
    Args:%0a%0d

Information:%0a%0d
   Display Name:%0a%0d
   UAN:%0a%0d
   Decimal: 8 (default)%0a%0d
   Description:%0a%0d
   Website:%0a%0d
   Icon File: attachment (40 x 40)%0a%0d
   Other Info:%0a%0d%0a%0d

Ref:%0a%0d
1. UAN: https://github.com/nervosnetwork/rfcs/pull/335%0a%0d

---------- Submit NRC 721 Factory Information ----------%0a%0d

Information:%0a%0d
   Deployment Tx Hash: %0a%0d
   Contract Source Code: %0a%0d
   Other Info:%0a%0d
`

export const HttpErrorCode = {
  NOT_FOUND_ADDRESS: 1010,
}

export const SearchFailType = {
  CHAIN_ERROR: 'chain_error',
}

export enum CellType {
  Input = 'input',
  Output = 'output',
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

export const ChartColor = {
  areaColor: '#31EEB3',
  colors: ['#5824FB', '#31EEB3', '#484E4E'],
  moreColors: ['#5824FB', '#66CC99', '#FBB04C', '#525860'],
  totalSupplyColors: ['#5824FB', '#31EEB3', '#484E4E'],
  daoColors: ['#5824FB', '#31EEB3', '#484E4E'],
  secondaryIssuanceColors: ['#484E4E', '#5824FB', '#31EEB3'],
  liquidityColors: ['#5824FB', '#484E4E', '#31EEB3'],
}

export enum ChainName {
  Mainnet = 'mirana',
  Testnet = 'pudge',
}

export enum LayoutLiteProfessional {
  Lite = 'lite',
  Professional = 'professional',
}

export const MAINNET_URL = `https://${config.BASE_URL}`
export const TESTNET_URL = `https://${ChainName.Testnet}.${config.BASE_URL}`
