import { Cell } from '../models/Cell'
import { Transaction } from '../models/Transaction'
import type { CellInScript, CKBTransactionInScript } from '../services/ExplorerService/fetcher'

// TODO: move to models
export const transformToTransaction = (tx: CKBTransactionInScript): Transaction => {
  return {
    transactionHash: tx.txHash,
    blockNumber: tx.blockNumber,
    blockTimestamp: tx.blockTimestamp,
    transactionFee: String(tx.transactionFee),
    isCellbase: tx.isCellbase,
    displayInputs: tx.displayInputs,
    displayOutputs: tx.displayOutputs,
    txStatus: tx.txStatus,

    // defaults
    income: '',
    targetBlockNumber: 0,
    version: 0,
    liveCellChanges: '',
    capacityInvolved: '',
    detailedMessage: '',
    bytes: 0,
    largestTxInEpoch: 0,
    largestTx: 0,
    cycles: null,
    maxCyclesInEpoch: null,
    maxCycles: null,
  }
}

// TODO: move to models
export type CellBasicInfo = Pick<Cell, 'id' | 'isGenesisOutput' | 'capacity' | 'occupiedCapacity'>
export const transformToCellBasicInfo = (cell: CellInScript): CellBasicInfo => {
  return {
    id: cell.id,
    capacity: cell.capacity,
    occupiedCapacity: String(cell.occupiedCapacity),
    isGenesisOutput: false,
  }
}
