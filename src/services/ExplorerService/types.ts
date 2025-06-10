import { ReactNode } from 'react'
import { Cell } from '../../models/Cell'
import { HashType } from '../../constants/common'
import { Dob } from '../DobsService'
import { UDT } from '../../models/UDT'

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
    totalPages?: number
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
    h24TxCount: string
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

  export interface CkbHodlWaveHolderCount {
    ckbHodlWave: CkbHodlWaveDetail
    holderCount: string
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

  export interface KnowledgeSize {
    createdAtUnixtimestamp: string
    knowledgeSize: number
  }

  export interface ActiveAddresses {
    createdAtUnixtimestamp: string
    activityAddressContractDistribution: Record<string, number>[]
  }

  export interface AssetActivity {
    ckbTransactionsCount: string
    holdersCount: string
    createdAtUnixtimestamp: string
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
    cellType: 'spore_cell' | 'did_cell'
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
    udtInfo: Record<'symbol' | 'decimal' | 'typeHash' | 'amount', string>
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
    udtInfo: Record<'symbol' | 'decimal' | 'typeHash' | 'amount', string>
  }
  export interface XudtTransfer {
    capacity: string
    cellType: 'xudt' | 'xudt_compatible'
    udtInfo: Record<'symbol' | 'decimal' | 'typeHash' | 'amount', string>
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

export type SupportedExportTransactionType = 'address_transactions' | 'blocks' | 'udts' | 'nft' | 'omiga_inscriptions'

export interface RGBDigest {
  txid: string
  confirmations: number
  commitment: string
  leapDirection: string | null
  transfers: TransactionRecord[]
}

export interface BitcoinAddresses {
  unboundLiveCellsCount: number
  boundLiveCellsCount: number
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
  tags: string[]
  extraInfo: {
    collection: {
      typeHash: string
    }
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

export interface RGBCells {
  [key: string]: { data: Response.Wrapper<LiveCell, 'cell_output'> }[]
}

// new types

export namespace FeeRateTracker {
  export interface TransactionFeeRate {
    id: number
    timestamp: number
    feeRate: number
    confirmationTime: number
  }

  export interface PendingTransactionFeeRate {
    id: number
    feeRate: number
  }

  export interface LastNDaysTransactionFeeRate {
    date: string
    feeRate: string
  }

  export interface TransactionFeesStatistic {
    transactionFeeRates: TransactionFeeRate[]
    pendingTransactionFeeRates: PendingTransactionFeeRate[]
    lastNDaysTransactionFeeRates: LastNDaysTransactionFeeRate[]
  }

  export interface FeeRateCard {
    priority: string
    icon: ReactNode
    feeRate?: string
    priorityClass: string
    confirmationTime: number
  }
}

export interface NFTCollection {
  id: number
  standard: string
  name: string
  description: string
  h24_ckb_transactions_count: string
  creator: string | null
  icon_url: string | null
  items_count: number | null
  holders_count: number | null
  type_script: { code_hash: string; hash_type: 'data' | 'type'; args: string } | null
  tags: string[]
  sn: string
  timestamp: number
}

export interface NFTItem {
  icon_url: string | null
  id: number
  token_id: string
  owner: string | null
  standard: string | null
  cell: {
    cell_index: number
    data: string | null
    status: string
    tx_hash: string
  } | null
  collection: NFTCollection
  name: string | null
  metadata_url: string | null
  type_script: Record<'code_hash' | 'hash_type' | 'args' | 'script_hash', string>
  dob?: Dob
  created_at: string
}

export interface ScriptInfo {
  name: string
  dataHash: string
  typeHash: string
  hashType: HashType | null
  isTypeScript: boolean
  isLockScript: boolean
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  countOfTransactions: number
  countOfReferringCells: number
  rfc: string
  website: string
  sourceUrl: string
  deprecated: boolean
  verified: boolean
  scriptOutPoint: string
  depType: string
  description: string
}
export interface ScriptDetail {
  typeHash: string
  dataHash: string
  hashType: HashType | null
  txHash: string
  depType: string
  name: string
  rfc: string
  sourceCode: string
  website: string
  isTypeScript: boolean
  isLockScript: boolean
  deprecated: boolean
  deployedBlockTimestamp: number
  totalReferringCellsCapacity: string
}

export interface CKBTransactionInScript {
  isBtcTimeLock: boolean
  isRgbTransaction: boolean
  rgbTxid: string | null
  id: number
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  transactionFee: number
  isCellbase: boolean
  txStatus: string
  displayInputs: Cell[]
  displayOutputs: Cell[]
}

export interface CellInScript {
  id: number
  capacity: string
  data: string
  ckbTransactionId: number
  createdAt: string
  updatedAt: string
  status: string
  addressId: number
  blockId: number
  txHash: string
  cellIndex: number
  generatedById?: number
  consumedById?: number
  cellType: string
  dataSize: number
  occupiedCapacity: number
  blockTimestamp: number
  consumedBlockTimestamp: number
  typeHash?: string
  udtAmount: number
  dao: string
  lockScriptId?: number
  typeScriptId?: number
}

export interface TransferRes {
  id: number
  from: string | null
  to: string | null
  action: 'mint' | 'normal' | 'destruction'
  item: NFTItem
  transaction: {
    tx_hash: string
    block_number: number
    block_timestamp: number
  }
}

export interface TransferListRes {
  data: TransferRes[]
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}

export type DASAccount = string

export type DASAccountMap = Record<string, DASAccount | null>

export type UDTQueryResult = {
  fullName: string
  symbol: string | null
  typeHash: string
  iconFile: string | null
  udtType: UDT['udtType']
}

export type SubmitTokenInfoParams = {
  symbol: string
  email: string
  operator_website: string
  total_amount: number

  full_name?: string
  decimal?: number
  description?: string
  icon_file?: string
  token?: string
}

export interface RGBTransaction {
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  leapDirection: string
  rgbCellChanges: number
  rgbTxid: string
}

export namespace Fiber {
  export namespace Peer {
    interface Base {
      peerId: string
      rpcListeningAddr: string[]
      firstChannelOpenedAt: null // TODO
      lastChannelUpdatedAt: null // TODO
    }
    export interface ItemInList extends Base {
      name: string
      channelsCount: number
      totalLocalBalance: string // shannon amount
    }

    export interface Detail extends Base {
      fiberChannels: {
        peerId: string
        channelId: string
        stateName: string // TODO: should be enum
        stateFlags: [] // TODO
      }[]
    }
  }
  export namespace Channel {
    export interface Peer {
      name?: string
      peerId: string
      rpcListeningAddr: string[]
    }
    export interface Detail {
      channelId: string
      stateName: string // TODO should be name
      stateFlags: [] // TODO
      shutdownAt: null // TODO
      createdAt: string // utc time
      updatedAt: string // utc time
      localBalance: string // shannon
      offeredTlcBalance: string // shannon
      receivedTlcBalance: string // shannon
      remoteBalance: string // shannon
      localPeer: Peer
      remotePeer: Peer
    }
  }

  export namespace Graph {
    interface UdtConfigInfo {
      args: string
      codeHash: string
      hashType: HashType
      decimal?: number
      fullName?: string
      iconFile?: string
      symbol?: string
      autoAcceptAmount: string
    }

    interface OpenTransactionInfo {
      address: string
      blockNumber: number
      blockTimestamp: number
      capacity: string
      txHash: string
      udtInfo?: {
        symbol?: string
        decimal?: string
        amount: string
        typeHash: string
        iconFile?: string
      }
    }

    export type Transaction =
      | {
          index?: number
          isOpen: true
          isUdt: boolean
          txHash: string
          blockNumber: number
          blockTimestamp: number
          capacity: string
          udtInfo?: {
            symbol: string
            amount: string
            decimal: string
            typeHash: string
            published: boolean
          }
          address: string
        }
      | {
          index?: number
          isOpen: false
          isUdt: boolean
          txHash: string
          blockNumber: number
          blockTimestamp: number
          closeAccounts: {
            capacity: string
            udtInfo?: {
              symbol: string
              amount: string
              decimal: string
              typeHash: string
              published: boolean
            }
            address: string
          }[]
        }

    interface ClosedTransactionInfo {
      blockNumber: number
      blockTimestamp: number
      txHash: string
      closeAccounts: {
        address: string
        capacity: string
        udtInfo?: {
          symbol?: string
          decimal?: string
          amount: string
        }
      }[]
    }

    export interface Node {
      nodeName: string
      nodeId: string
      addresses: string[]
      createdTimestamp: string
      timestamp: string
      lastUpdatedTimestamp: string
      deletedAtTimestamp: string | null
      chainHash: string
      autoAcceptMinCkbFundingAmount: string
      udtCfgInfos: UdtConfigInfo[]
      totalCapacity: string
      connectedNodeIds: string[]
      openChannelsCount: number
    }

    export interface Channel {
      capacity: string
      chainHash: string
      channelOutpoint: string
      closedTransactionInfo: ClosedTransactionInfo
      createdTimestamp: string
      feeRateOfNode1: string
      feeRateOfNode2: string
      lastUpdatedTimestampOfNode1: string
      lastUpdatedTimestampOfNode2: string
      node1: string
      node2: string
      openTransactionInfo: OpenTransactionInfo
    }

    export interface NodeDetail extends Node {
      fiberGraphChannels: Channel[]
    }

    export type Statistics = (Record<
      | 'totalNodes'
      | 'totalChannels'
      | 'totalCapacity'
      | 'meanValueLocked'
      | 'meanFeeRate'
      | 'mediumValueLocked'
      | 'mediumFeeRate'
      | 'createdAtUnixtimestamp',
      string
    > & {
      totalLiquidity:
        | (
            | {
                symbol: 'CKB'
                amount: string
              }
            | {
                symbol: string
                amount: string
                decimal: string
                typeHash: string
              }
          )[]
        | null
    })[]

    export type GraphNodeIps = {
      nodeId: string
      addresses: string[]
      connections: string[]
    }[]
  }
}
