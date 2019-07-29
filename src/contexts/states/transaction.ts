export const initTransaction: State.Transaction = {
  transaction_hash: '',
  block_number: 0,
  block_timestamp: 0,
  transaction_fee: 0,
  is_cellbase: false,
  target_block_number: 0,
  version: 0,
  display_inputs: [],
  display_outputs: [],
}

export default initTransaction
