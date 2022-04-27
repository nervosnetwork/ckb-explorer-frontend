import { isMainnet } from '../utils/chain'

export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const FLUSH_CHART_CACHE_POLLING_TIME = 300000 // 5 minutes
export const RESIZE_LATENCY = 500
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11
export const PAGE_CELL_COUNT = 200
export const MAINTENANCE_ALERT_POLLING_TIME = 3600000 // 1 hour
export const NEXT_HARD_FORK_EPOCH = 5414
export const EPOCH_HOURS = 4
export const ONE_DAY_SECOND = 24 * 60 * 60
export const ONE_HOUR_SECOND = 60 * 60
export const ONE_MINUTE_SECOND = 60
export const DEPLOY_TIME_LEFT = 10 * ONE_DAY_SECOND + 10 * ONE_HOUR_SECOND

export function getPrimaryColor(hasFinishedHardFork: boolean = false) {
  if (isMainnet()) {
    return hasFinishedHardFork ? '#00CC9B' : '#3CC68A'
  }
  return hasFinishedHardFork ? '#9A2CEC' : '#85A1EA'
}
export function getSecondaryColor(hasFinishedHardFork: boolean = false) {
  if (isMainnet()) {
    return hasFinishedHardFork ? '#00CC9B' : '#3CC68A'
  }
  return hasFinishedHardFork ? '#9A2CEC' : '#617BBD'
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
   Full Name: 32 length max%0a%0d
   Symbol: 8 length max / ASCII%0a%0d
   Decimal: 8 (default)%0a%0d
   Description:%0a%0d
   Website:%0a%0d
   Icon File: attachment (40 x 40)%0a%0d
   Other Info:%0a%0d%0a%0d

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

export const getChartColor = (hasFinishedHardFork: boolean = false) => {
  if (hasFinishedHardFork) {
    return {
      areaColor: '#31EEB3',
      colors: ['#5824FB', '#66CC99'],
      moreColors: ['#5824FB', '#66CC99', '#FBB04C', '#525860'],
      totalSupplyColors: ['#5824FB', '#31EEB3', '#484E4E'],
      daoColors: ['#5824FB', '#31EEB3', '#484E4E'],
      secondaryIssuanceColors: ['#484E4E', '#5824FB', '#31EEB3'],
      liquidityColors: ['#5824FB', '#484E4E', '#31EEB3'],
    }
  }
  return {
    areaColor: '#85bae0',
    colors: ['#3182bd', '#66CC99'],
    moreColors: ['#3182bd', '#66CC99', '#FBB04C', '#525860'],
    totalSupplyColors: ['#049ECD', '#69C7D4', '#74808E'],
    daoColors: ['#049ECD', '#69C7D4', '#74808E'],
    secondaryIssuanceColors: ['#74808E', '#049ECD', '#69C7D4'],
    liquidityColors: ['#3182bd', '#74808E', '#69C7D4'],
  }
}
