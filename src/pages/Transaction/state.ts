import { Transaction } from '../../models/Transaction'
import { TransactionRecord } from '../../services/ExplorerService'

export const defaultTransactionInfo: Transaction = {
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
  cellDeps: [],
  headerDeps: [],
  witnesses: [],
  liveCellChanges: '',
  capacityInvolved: '',
  txStatus: '',
  detailedMessage: '',
  bytes: 0,
  largestTxInEpoch: 0,
  largestTx: 0,
  cycles: null,
  maxCyclesInEpoch: null,
  maxCycles: null,
}

export const defaultTransactionLiteDetails: TransactionRecord[] = [
  {
    address: '',
    transfers: [],
  },
]
