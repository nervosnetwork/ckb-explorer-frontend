export const initTransaction: State.Transaction = {
  transactionHash: '',
  blockNumber: 0,
  blockTimestamp: 0,
  transactionFee: 0,
  isCellbase: false,
  targetBlockNumber: 0,
  version: 0,
  displayInputs: [],
  displayOutputs: [],
}

export default initTransaction
