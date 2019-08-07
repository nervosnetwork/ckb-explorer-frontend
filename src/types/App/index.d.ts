declare namespace State {
  export interface Script {
    code_hash: string
    args: string[]
    hash_type: string
  }

  export interface Data {
    data: string
  }

  export interface NodeVersion {
    version: string
  }

  export interface ToastMessage {
    message: string
    duration?: number
    id: number
  }

  export interface Modal {
    ui: React.ComponentType
    maskTop: number
    maskColor: string
  }

  export interface AppError {
    type: 'Network' | 'ChainAlert' | 'Maintain'
    message: string[]
  }

  interface InputOutput {
    id: number
    address_hash: string
    capacity: number
    from_cellbase: boolean
    target_block_number: number
    base_reward: number
    secondary_reward: number
    commit_reward: number
    proposal_reward: number
    isGenesisOutput: boolean
  }

  export interface Address {
    address_hash: string
    lock_hash: string
    balance: number
    transactions_count: number
    cell_consumed: number
    lock_script: Script
    pending_reward_blocks_count: number
    type: 'Address' | 'LockHash' | ''
  }

  export interface Block {
    blockHash: string
    number: number
    transactionsCount: number
    proposalsCount: number
    unclesCount: number
    uncleBlockHashes: string[]
    reward: number
    rewardStatus: 'pending' | 'issued'
    totalTransactionFee: number
    receivedTxFee: number
    receivedTxFeeStatus: 'calculating' | 'calculated'
    cellConsumed: number
    totalCellCapacity: number
    minerHash: string
    timestamp: number
    difficulty: string
    epoch: number
    length: string
    startNumber: number
    version: number
    nonce: number
    proof: string
    transactionsRoot: string
    witnessesRoot: string
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
    tipBlockNumber: string
    currentEpochAverageBlockTime: string
    currentEpochDifficulty: number
    hashRate: string
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

  export interface StatisticsChartData {
    blockNumber: number
    hashRate: string
    difficulty: number
    epochnumber: number
  }

  export interface Components {
    // mobile header search state
    searchBarEditable: boolean
  }

  export interface App {
    toast: State.ToastMessage | null
    loading: boolean
    modal: State.Modal | null
    appErrors: [
      { type: 'Network'; message: string[] },
      { type: 'ChainAlert'; message: string[] },
      { type: 'Maintain'; message: string[] },
    ]
    nodeVersion: string
    tipBlockNumber: number

    appWidth: number
    appHeight: number
    appLanguage: string
  }

  export interface AddressState {
    address: Address
    transactions: Transaction[]
    total: number
  }

  export interface BlockState {
    block: Block
    transactions: Transaction[]
    total: number
  }

  export interface BlockListState {
    blocks: Block[]
    total: number
  }

  export interface AppState {
    app: App

    addressState: AddressState
    blockState: BlockState
    homeBlocks: Block[]
    blockListState: BlockListState
    transaction: Transaction
    statistics: Statistics
    statisticsChartDatas: StatisticsChartDatas

    components: Components
  }
}

declare namespace CustomRouter {
  interface Route {
    name: string
    path: string
    params?: string
    exact?: boolean
    comp: React.FunctionComponent<any>
  }
}
