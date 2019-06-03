export interface Block {
  block_hash: string
  number: number
  transactions_count: number
  proposal_transactions_count: number
  uncles_count: number
  uncle_block_hashes: string[]
  reward: number
  total_transaction_fee: number
  cell_consumed: number
  total_cell_capacity: number
  miner_hash: string
  timestamp: number
  difficulty: string
  epoch: number
  length: string
  start_number: number
  version: number
  nonce: number
  proof: string
  transactions_root: string
  witnesses_root: string
}

export interface BlockWrapper {
  id: number
  type: string
  attributes: Block
}
