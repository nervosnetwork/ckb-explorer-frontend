export const initAddressState: State.AddressState = {
  address: {
    addressHash: '',
    lockHash: '',
    balance: 0,
    transactionsCount: 0,
    pendingRewardBlocksCount: 0,
    cellConsumed: 0,
    lockScript: {
      args: [],
      codeHash: '',
      hashType: '',
    },
    type: '',
  },
  transactions: [] as State.Transaction[],
  total: 0,
  status: 'none',
}

export default initAddressState
