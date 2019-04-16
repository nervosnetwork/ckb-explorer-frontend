export interface Transaction {
  transaction_hash: string
  block_number: string
  block_timestamp: number
  transaction_fee: number
  version: number
  display_inputs: Input[]
  display_outputs: Output[]
}

export interface TransactionWrapper {
  id: number
  type: string
  attributes: Transaction
}

export interface Input {
  input_id: number
  address_hash: string
  capacity: number
}

export interface Output {
  output_id: number
  address_hash: string
  capacity: number
}
