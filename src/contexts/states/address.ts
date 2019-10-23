export const initAddressState: State.AddressState = {
  address: {
    addressHash: '',
    lockHash: '',
    balance: '0',
    transactionsCount: 0,
    pendingRewardBlocksCount: 0,
    lockScript: {
      args: '',
      codeHash: '',
      hashType: '',
    },
    type: '',
  },
  transactions: [],
  total: 0,
  addressStatus: 'None',
  transactionsStatus: 'None',
}

export default initAddressState
