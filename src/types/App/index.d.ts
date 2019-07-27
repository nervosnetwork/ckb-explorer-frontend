declare namespace State {
  export interface Script {
    code_hash: string
    args: string[]
    hash_type: string
  }

  export interface Data {
    data: string
  }

  export interface Address {
    address_hash: string
    lock_hash: string
    balance: number
    transactions_count: number
    cell_consumed: number
    lock_script: Script
    pending_reward_blocks_count: number
  }

  export interface Block {
    block_hash: string
    number: number
    transactions_count: number
    proposals_count: number
    uncles_count: number
    uncle_block_hashes: string[]
    reward: number
    reward_status: 'pending' | 'issued'
    total_transaction_fee: number
    received_tx_fee: number
    received_tx_fee_status: 'calculating' | 'calculated'
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

  interface InputOutput {
    id: number
    address_hash: string
    capacity: number
    from_cellbase: boolean
    target_block_number: number
    block_reward: number
    secondary_reward: number
    commit_reward: number
    proposal_reward: number
    isGenesisOutput: boolean
  }

  export interface BlockchainInfo {
    blockchain_info: {
      is_initial_block_download: boolean
      epoch: string
      difficulty: string
      median_time: string
      chain: string
      alerts: {
        id: string
        message: string
        notice_until: string
        priority: string
      }[]
    }
  }

  export interface Statistics {
    tip_block_number: string
    current_epoch_average_block_time: string
    current_epoch_difficulty: number
    hash_rate: string
  }

  export interface StatisticsChart {
    hash_rate: {
      block_number: number
      hash_rate: string
    }[]
    difficulty: {
      block_number: number
      difficulty: number
      epoch_number: number
    }[]
  }

  export interface NodeVersion {
    version: string
  }
}
