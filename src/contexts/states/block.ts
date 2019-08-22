export const initBlockState: State.BlockState = {
  block: {
    blockHash: '',
    number: 0,
    transactionsCount: 0,
    proposalsCount: 0,
    unclesCount: 0,
    uncleBlockHashes: [],
    reward: 0,
    rewardStatus: 'issued',
    receivedTxFee: 0,
    receivedTxFeeStatus: 'calculated',
    totalTransactionFee: 0,
    cellConsumed: 0,
    totalCellCapacity: 0,
    minerHash: '',
    timestamp: 0,
    difficulty: '',
    startNumber: 0,
    epoch: 0,
    length: '',
    version: 0,
    nonce: 0,
    proof: '',
    transactionsRoot: '',
    witnessesRoot: '',
  },
  transactions: [] as State.Transaction[],
  total: 0,
  status: 'None',
}

export const initBlockListState: State.BlockListState = {
  blocks: [] as State.Block[],
  total: 0,
}

export default {
  initBlockState,
  initBlockListState,
}
