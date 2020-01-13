import CONFIG from '../config'

export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const RESIZE_LATENCY = 500
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11

export const MAINNET_PRIMARY_THEME_COLOR = '#3cc68a'
export const MAINNET_SECONDARY_THEME_COLOR = '#3cc68a'
export const TESTNET_PRIMARY_THEME_COLOR = '#617bbd'
export const TESTNET_SECONDARY_THEME_COLOR = '#85A1EA'

export const HttpErrorCode = {
  NOT_FOUND_ADDRESS: 1010,
  ADDRESS_TYPE_ERROR: 1023,
}

export const SearchFailType = {
  CHAIN_ERROR: 'chain_error',
}

export const CachedKeys = {
  AppLanguage: `${CONFIG.CHAIN_TYPE}-AppLanguage`,
  SearchFailVisitedCount: `${CONFIG.CHAIN_TYPE}-SearchFailVisitedCount`,
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
