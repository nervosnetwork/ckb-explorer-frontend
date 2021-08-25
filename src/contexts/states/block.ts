export const initBlockState: State.BlockState = {
  block: {
    blockHash: '',
    number: 0,
    transactionsCount: 0,
    proposalsCount: 0,
    unclesCount: 0,
    uncleBlockHashes: [],
    reward: '0',
    rewardStatus: 'issued',
    receivedTxFee: '0',
    receivedTxFeeStatus: 'calculated',
    totalTransactionFee: '0',
    totalCellCapacity: '0',
    minerHash: '',
    minerMessage: '',
    timestamp: 0,
    difficulty: '',
    startNumber: 0,
    epoch: 0,
    length: '',
    version: 0,
    nonce: '0',
    transactionsRoot: '',
    blockIndexInEpoch: '',
    minerReward: '',
    liveCellChanges: '',
  },
  transactions: [],
  total: 0,
  status: 'None',
}

export const initBlockListState: State.BlockListState = {
  blocks: [],
  total: 0,
}

export default {
  initBlockState,
  initBlockListState,
}
