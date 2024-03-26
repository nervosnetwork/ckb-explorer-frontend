import { Script } from '../Script'

export interface UDTInfo {
  symbol: string
  amount: string
  decimal: string
  typeHash: string
  published: boolean
  uan?: string
}

export interface Nrc721TokenInfo {
  amount: string
  symbol: string
}

export interface NftIssuer {
  issuerName: string
}

export interface NftClass {
  className: string
  total: string
}

export interface NftToken {
  className: string
  tokenId: string
  total: string
}

export interface CellInfo {
  lock: Script
  type: Script
  data: string
}

export interface Cell$Base {
  id: number
  addressHash: string
  capacity: string
  occupiedCapacity: string
  fromCellbase: boolean
  generatedTxHash: string
  targetBlockNumber: number
  baseReward: string
  secondaryReward: string
  commitReward: string
  proposalReward: string
  consumedTxHash: string
  status: 'live' | 'dead'
  isGenesisOutput: boolean
  cellIndex: string
  compensationStartedBlockNumber: number
  compensationEndedBlockNumber: number
  compensationStartedTimestamp: number
  compensationEndedTimestamp: number
  lockedUntilBlockNumber: number
  lockedUntilBlockTimestamp: number
  interest: string
  daoTypeHash: string
  cellInfo: CellInfo
  since?: {
    raw: string
    median_timestamp?: string
  }
}

export interface Cell$NoExtra extends Cell$Base {
  cellType:
    | 'normal'
    | 'nervos_dao_deposit'
    | 'nervos_dao_withdrawing'
    | 'cota_registry'
    | 'cota_regular'
    // TODO: Perhaps nft_transfer, simple_transfer, and nft_mint should be removed, as they cannot be found
    // at https://github.com/nervosnetwork/ckb-explorer/blob/develop/app/utils/ckb_utils.rb#L380.
    | 'nft_transfer'
    | 'simple_transfer'
    | 'nft_mint'
    | 'spore_cluster'
    | 'spore_cell'
    | 'nrc_721_factory'
    | 'omiga_inscription'
  extraInfo?: never
}

export interface Cell$UDT extends Cell$Base {
  cellType: 'udt'
  extraInfo: UDTInfo
}

export interface Cell$NftIssuer extends Cell$Base {
  cellType: 'm_nft_issuer'
  extraInfo: NftIssuer
}

export interface Cell$NftClass extends Cell$Base {
  cellType: 'm_nft_class'
  extraInfo: NftClass
}

export interface Cell$NftToken extends Cell$Base {
  cellType: 'm_nft_token'
  extraInfo: NftToken
}

export interface Cell$Nrc721Token extends Cell$Base {
  cellType: 'nrc_721_token'
  extraInfo: Nrc721TokenInfo
}

export interface Omiga$XUDT extends Cell$Base {
  cellType: 'omiga_inscription'
  extraInfo: Record<'amount' | 'decimal' | 'name' | 'symbol', string>
}

export type Cell =
  | Cell$NoExtra
  | Cell$UDT
  | Cell$NftIssuer
  | Cell$NftClass
  | Cell$NftToken
  | Cell$Nrc721Token
  | Omiga$XUDT
