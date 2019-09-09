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
  },
  status: 'None',
}

export default initTransactionState
