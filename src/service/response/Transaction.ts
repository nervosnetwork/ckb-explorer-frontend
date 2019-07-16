export interface Transaction {
  transaction_hash: string
  block_number: number
  block_timestamp: number
  transaction_fee: number
  is_cellbase: boolean
  target_block_number: number
  version: number
  display_inputs: InputOutput[]
  display_outputs: InputOutput[]
}

export interface TransactionWrapper {
  id: number
  type: string
  attributes: Transaction
}

export interface InputOutput {
  id: number
  address_hash: string
  capacity: number
  from_cellbase: boolean
  target_block_number: number
  block_reward: number
  commit_reward: number
  proposal_reward: number
  isGenesisOutput: boolean
}
