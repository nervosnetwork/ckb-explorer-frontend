import { Script } from '../Script'

export interface UDT {
  symbol: string
  fullName: string
  iconFile: string
  published: boolean
  description: string
  totalAmount: string
  addressesCount: string
  decimal: string
  h24CkbTransactionsCount: string
  createdAt: string
  typeHash: string
  issuerAddress: string
  typeScript: Script
  // TODO: Not quite sure if there are only two types here, so add a string for now.
  udtType: 'omiga_inscription' | 'sudt' | string
  operatorWebsite?: string
  email?: string
}

export enum MintStatus {
  Minting = 'minting',
  Closed = 'closed',
  RebaseStart = 'rebase_start',
}

export interface OmigaInscriptionCollection extends UDT {
  mintStatus: MintStatus
  mintLimit: string
  expectedSupply: string
  inscriptionInfoId: string
  infoTypeHash: string
  isRepeatedSymbol: boolean
}

export function isOmigaInscriptionCollection(udt: UDT): udt is OmigaInscriptionCollection {
  return 'mintStatus' in udt && 'mintLimit' in udt && 'expectedSupply' in udt && 'inscriptionInfoId' in udt
}
