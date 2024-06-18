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

  export interface Bitcoin {
    timestamp: number
    transactionsCount: number
    addressesCount: number
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

  export interface ContractResourceDistributed {
    name: string
    codeHash: string
    hashType: string
    addressCount: string
    ckbAmount: string
    txCount: string
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

  export interface CkbHodlWave {
    ckbHodlWave: CkbHodlWaveDetail
    createdAtUnixtimestamp: string
  }

  export interface CkbHodlWaveDetail {
    overThreeYears: number
    oneYearToThreeYears: number
    sixMonthsToOneYear: number
    threeMonthsToSixMonths: number
    oneMonthToThreeMonths: number
    oneWeekToOneMonth: number
    dayToOneWeek: number
    latestDay: number
    totalSupply: number
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
  transfers: LiteTransfer.Transfer[]
}

export namespace LiteTransfer {
  // Plain CKB Transfer
  export interface CKBTransfer {
    capacity: string
    cellType: 'normal'
  }

  // MNFT
  export interface NFTTransfer {
    capacity: string
    cellType: 'm_nft_token'
    // FIXME: This is a typo in the api, should be fixed
    toeknId?: string
    tokenId: string
    name: string
    count: string
  }

  export interface NFTClassTransfer {
    capacity: string
    cellType: 'm_nft_class'
  }

  export interface NFTIssuerTransfer {
    capacity: string
    cellType: 'm_nft_issuer'
  }
  // NRC 721
  export interface NRC721Transfer {
    capacity: string
    cellType: 'nrc_721_token'
    // FIXME: This is a typo in the api, should be fixed
    toeknId?: string
    tokenId: string
    name: string
    count: string
  }

  export interface NRC721FactoryTransfer {
    capacity: string
    cellType: 'nrc_721_factory'
  }

  // Spore
  export interface SporeTransfer {
    capacity: string
    cellType: 'spore_cell'
    // FIXME: This is a typo in the api, should be fixed
    toeknId?: string
    tokenId: string
    name: string
    count: string
  }

  export interface SporeClusterTransfer {
    capacity: string
    cellType: 'spore_cluster'
  }

  // udt
  export interface UDTTransfer {
    capacity: string
    cellType: 'udt'
    udtInfo: Record<'symbol' | 'decimal' | 'displayName' | 'typeHash' | 'uan' | 'amount', string>
  }

  // Cota
  export interface CotaTransfer {
    capacity: string
    cellType: 'cota_regular'
    cotaInfo: Record<'name' | 'count' | 'tokenId', string>[]
  }

  export interface CotaRegistryTransfer {
    capacity: string
    cellType: 'cota_registry'
  }

  export interface OmigaTransfer {
    capacity: string
    cellType: 'omiga_inscription'
    name: string
    count: string
    udtInfo: Record<'symbol' | 'decimal' | 'displayName' | 'typeHash' | 'uan' | 'amount', string>
  }
  export interface XudtTransfer {
    capacity: string
    cellType: 'xudt' | 'xudt_compatible'
    udtInfo: Record<'symbol' | 'decimal' | 'displayName' | 'typeHash' | 'uan' | 'amount', string>
  }

  export type Transfer =
    | CKBTransfer
    | NFTTransfer
    | NFTClassTransfer
    | NFTIssuerTransfer
    | NRC721Transfer
    | NRC721FactoryTransfer
    | SporeTransfer
    | SporeClusterTransfer
    | UDTTransfer
    | CotaTransfer
    | CotaRegistryTransfer
    | OmigaTransfer
    | XudtTransfer
}

interface FetchStatusValue {
  OK: string
  Error: string
  InProgress: string
  None: string
}

// Unused currently
export type FetchStatus = keyof FetchStatusValue

export type SupportedExportTransactionType = 'address_transactions' | 'blocks' | 'udts' | 'nft' | 'omiga_inscriptions'

export interface RGBDigest {
  txid: string
  confirmations: number
  commitment: string
  transfers: TransactionRecord[]
}

export namespace RawBtcRPC {
  interface Utxo {
    value: number
    scriptPubKey: {
      asm: string
      address: string
    }
  }
  interface Vin {
    txid: string
    prevout: Utxo
    vout: number
  }

  interface Vout extends Utxo {}

  export interface BtcTx {
    txid: string
    hash: string
    vin: Vin[]
    vout: Vout[]
    blocktime?: number
    confirmations?: number
  }
}

export interface Script {
  codeHash: string
  args: string
  hashType: string
}

export interface LiveCell {
  cellId: string
  cellType: string
  txHash: string
  cellIndex: number
  typeHash: string
  data: string
  capacity: string
  occupiedCapacity: string
  blockTimestamp: string
  blockNumber: string
  typeScript: Script
  lockScript: Script
  extraInfo: {
    symbol: string
    amount: string
    decimal: string
    typeHash: string
    published: boolean
    type: 'ckb' | 'udt' | 'nrc_721' | 'm_nft'
    className: string
    tokenId: string
  }
}

export interface TokenCollection {
  standard: string
  name: string
  description: string
  iconUrl: string
  symbol: string
  sn: string
}
