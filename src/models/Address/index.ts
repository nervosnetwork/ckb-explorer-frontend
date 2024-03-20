import { Script } from '../Script'
import { UDTAccount } from './UDTAccount'

export interface LockInfo {
  status: 'locked' | 'unlocked'
  epochNumber: string
  epochIndex: string
  estimatedUnlockTime: string
}

export interface Address {
  addressHash: string
  lockHash: string
  balance: string
  balanceOccupied: string
  transactionsCount: number
  lockScript: Script
  pendingRewardBlocksCount: number
  type: 'Address' | 'LockHash' | ''
  daoDeposit: number
  interest: number
  daoCompensation: number
  lockInfo: LockInfo
  liveCellsCount: string
  minedBlocksCount: string
  isSpecial: boolean
  specialAddress: string
  udtAccounts?: UDTAccount[]
}

export * from './UDTAccount'
