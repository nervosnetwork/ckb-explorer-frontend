declare namespace State {
  export interface Script {
    codeHash: string
    args: string
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
    type: 'success' | 'warning' | 'danger'
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

  interface Cell {
    id: number
    addressHash: string
    capacity: string
    fromCellbase: boolean
    generatedTxHash: string
    targetBlockNumber: number
    baseReward: string
    secondaryReward: string
    commitReward: string
    proposalReward: string
    consumedTxHash: string
    status: 'live' | 'dead'
    isGenesisOutput: boolean
    cellType: 'normal' | 'dao'
    startedBlockNumber: number
    endedBlockNumber: number
    interest: string
    daoTypeHash: string
  }

  export interface LockInfo {
    status: 'locked' | 'unlocked'
    epochNumber: string
    epochIndex: string
    estimatedUnlockTime: string
  }

  export interface Address {
    addressHash: string
    lockHash: string
    balance: string
    transactionsCount: number
    lockScript: Script
    pendingRewardBlocksCount: number
    type: 'Address' | 'LockHash' | ''
    daoDeposit: number
    interest: number
    lockInfo: LockInfo
    liveCellsCount: string
    minedBlocksCount: string
    isSpecial: boolean
    specialAddress: string
  }

  export interface Block {
    blockHash: string
    number: number
    transactionsCount: number
    proposalsCount: number
    unclesCount: number
    uncleBlockHashes: string[]
    reward: string
    rewardStatus: 'pending' | 'issued'
    totalTransactionFee: string
    receivedTxFee: string
    receivedTxFeeStatus: 'pending' | 'calculated'
    totalCellCapacity: string
    minerHash: string
    timestamp: number
    difficulty: string
    epoch: number
    length: string
    startNumber: number
    version: number
    nonce: string
    transactionsRoot: string
    blockIndexInEpoch: string
    liveCellChanges: string
  }

  export interface CellDep {
    depType: string
    outPoint: {
      index: string
      txHash: string
    }
  }

  export interface Transaction {
    transactionHash: string
    blockNumber: number
    blockTimestamp: number
    transactionFee: string
    income: string
    isCellbase: boolean
    targetBlockNumber: number
    version: number
    displayInputs: Cell[]
    displayOutputs: Cell[]
    cellDeps: CellDep[]
    headerDeps: string[]
    witnesses: string[]
    liveCellChanges: string
    capacityInvolved: string
  }

  export interface BlockchainInfo {
    blockchainInfo: {
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

  export interface NervosDao {
    totalDeposit: number
    interestGranted: number
    depositTransactionsCount: number
    withdrawTransactionsCount: number
    depositorsCount: number
    totalDepositorsCount: number
    daoTypeHash: string
  }

  export interface NervosDaoDepositor {
    addressHash: string
    daoDeposit: number
  }

  export interface NervosDaoState {
    nervosDao: NervosDao
    transactions: Transaction[]
    total: number
    depositors: NervosDaoDepositor[]
    status: keyof FetchStatus
  }

  export interface Statistics {
    tipBlockNumber: string
    averageBlockTime: string
    currentEpochDifficulty: string
    hashRate: string
    epochInfo: {
      epochNumber: string
      epochLength: string
      index: string
    }
    estimatedEpochTime: string
    transactionsLast24Hrs: string
    transactionsCountPerMinute: string
  }

  export interface StatisticsChart {
    hashRate: {
      blockNumber: number
      hashRate: string
    }[]
    difficulty: {
      blockNumber: number
      difficulty: string
      epochNumber: number
    }[]
    uncleRate: {
      uncleRate: number
      epochNumber: number
    }[]
  }

  export interface StatisticsBaseData {
    blockNumber: number
    type: 'Difficulty' | 'HashRate' | 'EpochNumber'
    difficulty?: number
    hashRate?: number
    epochNumber?: number
  }

  export interface StatisticUncleRate {
    uncleRate: number
    epochNumber: number
  }

  export interface StatisticTransactionCount {
    transactionsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticAddressCount {
    addressesCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticTotalDaoDeposit {
    totalDaoDeposit: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticDifficultyHashRate {
    difficulty: string
    hashRate: string
    blockNumber: string
  }

  export interface StatisticCellCount {
    liveCellsCount: string
    deadCellsCount: string
    blockNumber: string
  }

  export interface StatisticDifficultyUncleRate {
    difficulty: string
    uncleRate: string
    epochNumber: string
  }

  export interface StatisticAddressBalanceRank {
    ranking: string
    address: string
    balance: string
  }

  export interface StatisticAddressBalanceRanking {
    addressBalanceRanking: StatisticAddressBalanceRank[]
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
    secondLoading: boolean
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
    addressStatus: keyof FetchStatus
    transactionsStatus: keyof FetchStatus
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
    statisticsChartData: StatisticsBaseData[]
    statisticsUncleRates: StatisticsUncleRateChart[]
    statisticDifficultyHashRates: StatisticsDifficultyHashRate[]
    statisticDifficultyUncleRates: StatisticsDifficultyUncleRate[]
    statisticTransactionCounts: StatisticTransactionCount[]
    statisticCellCounts: StatisticCellCount[]
    statisticTotalDaoDeposits: StatisticTotalDaoDeposit[]
    statisticAddressCounts: StatisticAddressCount[]
    statisticAddressBalanceRanks: StatisticAddressBalanceRank[]

    nervosDaoState: NervosDaoState

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
