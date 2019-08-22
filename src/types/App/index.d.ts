declare namespace State {
  export interface Script {
    codeHash: string
    args: string[]
    hashType: string
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
    addressHash: string
    capacity: number
    fromCellbase: boolean
    targetBlockNumber: number
    baseReward: number
    secondaryReward: number
    commitReward: number
    proposalReward: number
    isGenesisOutput: boolean
  }

  export interface Address {
    addressHash: string
    lockHash: string
    balance: number
    transactionsCount: number
    cellConsumed: number
    lockScript: Script
    pendingRewardBlocksCount: number
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
    transactionHash: string
    blockNumber: number
    blockTimestamp: number
    transactionFee: number
    isCellbase: boolean
    targetBlockNumber: number
    version: number
    displayInputs: InputOutput[]
    displayOutputs: InputOutput[]
  }

  export interface BlockchainInfo {
    blockchain_info: {
      isInitialBlockDownload: boolean
      epoch: string
      difficulty: string
      medianTime: string
      chain: string
      alerts: {
        id: string
        message: string
        noticeNntil: string
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
    hashRate: {
      blockNumber: number
      hashRate: string
    }[]
    difficulty: {
      blockNumber: number
      difficulty: number
      epochNumber: number
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

  export interface FetchStatus {
    OK: string
    Error: string
    None: string
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
    language: 'en' | 'zh'
  }

  export interface AddressState {
    address: Address
    transactions: Transaction[]
    total: number
    status: keyof FetchStatus
  }

  export interface BlockState {
    block: Block
    transactions: Transaction[]
    total: number
    status: keyof FetchStatus
  }

  export interface BlockListState {
    blocks: Block[]
    total: number
  }

  export interface TransactionState {
    transaction: Transaction
    status: keyof FetchStatus
  }

  export interface AppState {
    app: App

    addressState: AddressState
    blockState: BlockState
    homeBlocks: Block[]
    blockListState: BlockListState
    transactionState: TransactionState
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
