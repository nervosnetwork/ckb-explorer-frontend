import { Cell } from '../../models/Cell'

export namespace Response {
  export interface Response<T> {
    data: T
    meta?: Meta
    error?: Error[]
  }

  export interface Error {
    id: string
    code: number
    status: number
    title: string
    detail: string
    href: string
  }

  export interface Meta {
    total: number
    pageSize: number
  }

  export interface Wrapper<A, T = string> {
    id: number
    type: T
    attributes: A
  }
}

// This is more suitable as a type at the model abstraction level,
// but considering that this type will only be used by a single ChartComp and fetcher, in order not to add too much
// complexity, it is directly treated as a type with strong server-side properties and placed here.
export namespace ChartItem {
  export interface TransactionCount {
    transactionsCount: string
    createdAtUnixtimestamp: string
  }

  export interface AddressCount {
    addressesCount: string
    createdAtUnixtimestamp: string
  }

  export interface TotalDaoDeposit {
    totalDaoDeposit: string
    totalDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface NewDaoDeposit {
    dailyDaoDeposit: string
    dailyDaoDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface CirculationRatio {
    circulationRatio: string
    createdAtUnixtimestamp: string
  }

  export interface DifficultyHashRate {
    difficulty: string
    uncleRate: string
    hashRate: string
    epochNumber: string
  }

  export interface Difficulty {
    avgDifficulty: string
    createdAtUnixtimestamp: string
  }

  export interface HashRate {
    avgHashRate: string
    createdAtUnixtimestamp: string
  }

  export interface UncleRate {
    uncleRate: string
    createdAtUnixtimestamp: string
  }

  export interface CellCount {
    liveCellsCount: string
    deadCellsCount: string
    allCellsCount: string
    createdAtUnixtimestamp: string
  }

  export interface DifficultyUncleRateEpoch {
    epochNumber: string
    epochTime: string
    epochLength: string
  }

  export interface AddressBalanceRank {
    ranking: string
    address: string
    balance: string
  }

  export interface BalanceDistribution {
    balance: string
    addresses: string
    sumAddresses: string
  }

  export interface TransactionFee {
    totalTxFee: string
    createdAtUnixtimestamp: string
  }

  export interface BlockTimeDistribution {
    time: string
    ratio: string
  }

  export interface AverageBlockTime {
    timestamp: number
    avgBlockTimeDaily: string
    avgBlockTimeWeekly: string
  }

  export interface EpochTimeDistribution {
    time: string
    epoch: string
  }

  export interface TotalSupply {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    burnt: string
    lockedCapacity: string
  }

  export interface AnnualPercentageCompensation {
    year: number
    apc: string
  }

  export interface SecondaryIssuance {
    createdAtUnixtimestamp: string
    treasuryAmount: string
    miningReward: string
    depositCompensation: string
  }

  export interface InflationRate {
    year: number
    nominalApc: string
    nominalInflationRate: string
    realInflationRate: string
  }

  export interface Liquidity {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    liquidity: string
    daoDeposit: string
  }

  export interface MinerAddress {
    address: string
    radio: string
  }
}

export interface NervosDaoDepositor {
  addressHash: string
  daoDeposit: number
  averageDepositTime: string
}

export interface TransactionRecord {
  address: string
  transfers: TransactionRecordTransfer[]
}

export interface TransactionRecordTransfer {
  capacity: string
  cellType: Cell['cellType']

  udtInfo?: {
    symbol: string
    amount: string
    decimal: string
    typeHash: string
    published: boolean
    displayName: string
    uan: string
  }

  mNftInfo?: {
    className: string
    tokenId: string // none 0x prefix hex number
    total: string // decimal string
  }
}

interface FetchStatusValue {
  OK: string
  Error: string
  InProgress: string
  None: string
}

// Unused currently
export type FetchStatus = keyof FetchStatusValue

export type SupportedExportTransactionType = 'address_transactions' | 'blocks' | 'udts' | 'nft'
