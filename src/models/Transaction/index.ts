import { Cell } from '../Cell'

export interface CellDep {
  depType: string
  outPoint: {
    index: string
    txHash: string
  }
}

export interface Transaction {
  isRgbTransaction: boolean
  transactionHash: string
  // FIXME: this type declaration should be fixed by adding a transformation between internal state and response of API
  blockNumber: number | string
  blockTimestamp: number | string
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

export interface BtcTx {
  txId: string
  transactionHash: string
  ckbTransactionHash: string
}
