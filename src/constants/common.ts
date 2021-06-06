export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const FLUSH_CHART_CACHE_POLLING_TIME = 300000 // 5 minutes
export const RESIZE_LATENCY = 500
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11
export const PAGE_CELL_COUNT = 200
export const MAINTENANCE_ALERT_POLLING_TIME = 3600000 // 1 hour

export const MAINNET_PRIMARY_THEME_COLOR = '#3cc68a'
export const MAINNET_SECONDARY_THEME_COLOR = '#3cc68a'
export const TESTNET_PRIMARY_THEME_COLOR = '#617bbd'
export const TESTNET_SECONDARY_THEME_COLOR = '#85A1EA'

export const TOKEN_EMAIL_ADDRESS = 'asset-info-submit@nervina.io'
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
   Decimal: 8 (default)%0a%0d
   Description:%0a%0d
   Website:%0a%0d
   Icon File: attachment (40 x 40)%0a%0d
   Other Info:%0a%0d

Note: Only accept sUDT information submission now.
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
export const ChartMoreColors = ['#3182bd', '#66CC99', '#FBB04C', '#525860']
