export const initBlockState: State.BlockState = {
  block: {
    block_hash: '',
    number: 0,
    transactions_count: 0,
    proposals_count: 0,
    uncles_count: 0,
    uncle_block_hashes: [],
    reward: 0,
    reward_status: 'issued',
    received_tx_fee: 0,
    received_tx_fee_status: 'calculated',
    total_transaction_fee: 0,
    cell_consumed: 0,
    total_cell_capacity: 0,
    miner_hash: '',
    timestamp: 0,
    difficulty: '',
    start_number: 0,
    epoch: 0,
    length: '',
    version: 0,
    nonce: 0,
    proof: '',
    transactions_root: '',
    witnesses_root: '',
  },
  transactions: [] as State.Transaction[],
  total: 0,
}

export const initBlockListState: State.BlockListState = {
  blocks: [] as Response.Wrapper<State.Block>[],
  total: 0,
}

export default {
  initBlockState,
  initBlockListState,
}
