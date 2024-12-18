import { Transaction } from '../../models/Transaction'
import { TransactionRecord } from '../../services/ExplorerService'

export const defaultTransactionInfo: Transaction = {
  isBtcTimeLock: false,
  isRgbTransaction: false,
  rgbTxid: null,
  transactionHash: '',
  blockNumber: 0,
  blockTimestamp: 0,
  transactionFee: '0',
  income: '0',
  isCellbase: false,
  targetBlockNumber: 0,
  version: 0,
  displayInputs: [],
  displayOutputs: [],
  liveCellChanges: '',
  capacityInvolved: '',
  txStatus: '',
  detailedMessage: '',
  rgbTransferStep: null,
  bytes: 0,
  largestTxInEpoch: 0,
  largestTx: 0,
  cycles: null,
  maxCyclesInEpoch: null,
  maxCycles: null,
  cellDeps: [],
  headerDeps: [],
  witnesses: [],
}

export const defaultTransactionLiteDetails: TransactionRecord[] = [
  {
    address: '',
    transfers: [],
  },
]
