import type { CellInScript, CKBTransactionInScript } from '../services/ExplorerService/fetcher'

export const transformToTransaction = (tx: CKBTransactionInScript): State.Transaction => {
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
    cellDeps: [],
    headerDeps: [],
    witnesses: [],
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

export type CellBasicInfo = Pick<State.Cell, 'id' | 'isGenesisOutput' | 'capacity' | 'occupiedCapacity'>
export const transformToCellBasicInfo = (cell: CellInScript): CellBasicInfo => {
  return {
    id: cell.id,
    capacity: cell.capacity,
    occupiedCapacity: String(cell.occupiedCapacity),
    isGenesisOutput: false,
  }
}
