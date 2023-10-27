export interface Block {
  blockHash: string
  number: number
  transactionsCount: number
  proposalsCount: number
  unclesCount: number
  uncleBlockHashes: string[]
  reward: string
  rewardStatus: 'pending' | 'issued'
  totalTransactionFee: string
  receivedTxFee: string
  receivedTxFeeStatus: 'pending' | 'calculated'
  totalCellCapacity: string
  minerHash: string
  minerMessage: string
  timestamp: number
  difficulty: string
  epoch: number
  length: string
  startNumber: number
  version: number
  nonce: string
  transactionsRoot: string
  blockIndexInEpoch: string
  minerReward: string
  liveCellChanges: string
  size: number
  largestBlockInEpoch: number
  largestBlock: number
  cycles: number | null
  maxCyclesInEpoch: number | null
  maxCycles: number | null
}
