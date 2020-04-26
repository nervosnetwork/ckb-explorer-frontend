export const initTransactionState: State.TransactionState = {
  transaction: {
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
  },
  status: 'None',
  scriptFetched: false,
}

export const initTransactionsState: State.TransactionsState = {
  transactions: [],
  total: 0,
}
