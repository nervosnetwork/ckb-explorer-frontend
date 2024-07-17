import { Cell } from '../models/Cell'
import { Transaction } from '../models/Transaction'
import { RawBtcRPC } from '../services/ExplorerService'
import type { CKBTransactionInScript, CellInScript } from '../services/ExplorerService/fetcher'

// TODO: move to models
export const transformToTransaction = (
  tx: CKBTransactionInScript & { btcTx: RawBtcRPC.BtcTx | null },
): Transaction & { btcTx: RawBtcRPC.BtcTx | null } => {
  return {
    isBtcTimeLock: tx.isBtcTimeLock,
    isRgbTransaction: tx.isRgbTransaction,
    rgbTxid: tx.rgbTxid,
    transactionHash: tx.txHash,
    blockNumber: tx.blockNumber,
    blockTimestamp: tx.blockTimestamp,
    transactionFee: String(tx.transactionFee),
    isCellbase: tx.isCellbase,
    displayInputs: tx.displayInputs,
    displayOutputs: tx.displayOutputs,
    txStatus: tx.txStatus,
    btcTx: tx.btcTx,

    // defaults
    income: '',
    targetBlockNumber: 0,
    version: 0,
    liveCellChanges: '',
    capacityInvolved: '',
    detailedMessage: '',
    rgbTransferStep: null,
    bytes: 0,
    largestTxInEpoch: 0,
    largestTx: 0,
    cycles: null,
    maxCyclesInEpoch: null,
    maxCycles: null,
  }
}

// TODO: move to models
export type CellBasicInfo = Pick<
  Cell,
  | 'id'
  | 'isGenesisOutput'
  | 'capacity'
  | 'occupiedCapacity'
  | 'generatedTxHash'
  | 'consumedTxHash'
  | 'cellIndex'
  | 'status'
  | 'rgbInfo'
>

export const transformToCellBasicInfo = (cell: CellInScript): CellBasicInfo => {
  return {
    id: cell.id,
    capacity: cell.capacity,
    occupiedCapacity: String(cell.occupiedCapacity),
    isGenesisOutput: false,
    generatedTxHash: cell.txHash,
    cellIndex: cell.cellIndex.toString(16),
    status: cell.status as 'live' | 'dead',
    consumedTxHash: '',
  }
}
