import { Script } from '../Script'
import { UDTAccount } from './UDTAccount'

export interface LockInfo {
  status: 'locked' | 'unlocked'
  epochNumber: string
  epochIndex: string
  estimatedUnlockTime: string
}

export enum AddressType {
  Address = 'Address',
  LockHash = 'LockHash',
  Unknown = 'Unknown',
}

export interface Address {
  bitcoinAddressHash?: string
  addressHash: string
  lockHash: string
  balance: string
  balanceOccupied: string
  transactionsCount: string
  lockScript: Script
  pendingRewardBlocksCount: string
  type: AddressType
  daoDeposit: string
  interest: string
  daoCompensation: string
  lockInfo: LockInfo
  liveCellsCount: string
  minedBlocksCount: string
  isSpecial: boolean
  specialAddress: string
  udtAccounts?: UDTAccount[]
}

export * from './UDTAccount'
