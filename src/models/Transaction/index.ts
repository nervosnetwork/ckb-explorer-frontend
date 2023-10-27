import { Cell } from '../Cell'

export interface CellDep {
  depType: string
  outPoint: {
    index: string
    txHash: string
  }
}

export interface Transaction {
  transactionHash: string
  blockNumber: number
  blockTimestamp: number
  transactionFee: string
  income: string
  isCellbase: boolean
  targetBlockNumber: number
  version: number
  displayInputs: Cell[]
  displayOutputs: Cell[]
  cellDeps: CellDep[]
  headerDeps: string[]
  witnesses: string[]
  liveCellChanges: string
  capacityInvolved: string
  txStatus: string
  detailedMessage: string
  bytes: number
  largestTxInEpoch: number
  largestTx: number
  cycles: number | null
  maxCyclesInEpoch: number | null
  maxCycles: number | null
  createTimestamp?: number
}
