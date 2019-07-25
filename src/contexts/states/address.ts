export const initAddressState: State.AddressState = {
  address: {
    address_hash: '',
    lock_hash: '',
    balance: 0,
    transactions_count: 0,
    pending_reward_blocks_count: 0,
    cell_consumed: 0,
    lock_script: {
      args: [],
      code_hash: '',
    },
  },
  transactions: [] as State.Transaction[],
  total: 0,
}

export default initAddressState
