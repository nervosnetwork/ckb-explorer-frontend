import { Cell } from '../Cell'

export interface CellDep {
  depType: string
  outPoint: {
    index: string
    txHash: string
  }
}

export interface Transaction {
  isBtcTimeLock: boolean
  isRgbTransaction: boolean
  rgbTxid: string | null
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
  liveCellChanges: string
  capacityInvolved: string
  rgbTransferStep: string | null
  txStatus: string
  detailedMessage: string
  bytes: number
  largestTxInEpoch: number
  largestTx: number
  cycles: number | null
  maxCyclesInEpoch: number | null
  maxCycles: number | null
  createTimestamp?: number
  cellDeps: CellDep[]
  headerDeps: string[]
  witnesses: string[]
}

export interface BtcTx {
  txid: string
  transactionHash: string
  ckbTransactionHash: string
}
