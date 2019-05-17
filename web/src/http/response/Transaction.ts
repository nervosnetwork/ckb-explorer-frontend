export interface Transaction {
  transaction_hash: string
  block_number: number
  block_timestamp: number
  transaction_fee: number
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
  select: string
  isGenesisOutput: boolean
}
