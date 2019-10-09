export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const RESIZE_LATENCY = 500
export const LOADING_WAITING_TIME = 500

// TODO: change mainnet and testnet theme color
export const MAINNET_THEME_COLOR = '#617bbd'
export const TESTNET_THEME_COLOR = '#3cc68a'

export const HttpErrorCode = {
  NOT_FOUND_ADDRESS: 1010,
}

export const CachedKeys = {
  // Block List
  BlockList: 'block_list',

  // Home
  Blocks: 'blocks',
  Statistics: 'statistics',

  // Statistics Chart
  StatisticsChart: 'statistics_chart',

  AppLanguage: 'appLanguage',

  SearchFailVisitedCount: 'SearchFailVisitedCount',

  IsMainnet: 'IsMainnet',
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

export enum BlockListPageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}
