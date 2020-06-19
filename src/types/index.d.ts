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

  export interface AppError {
    type: 'Network' | 'ChainAlert' | 'Maintain'
    message: string[]
  }

  interface UDTInfo {
    symbol: string
    amount: string
    decimal: string
    typeHash: string
    published: boolean
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
    cellType: 'normal' | 'nervos_dao_deposit' | 'nervos_dao_withdrawing' | 'udt'
    cellIndex: string
    compensationStartedBlockNumber: number
    compensationEndedBlockNumber: number
    compensationStartedTimestamp: number
    compensationEndedTimestamp: number
    lockedUntilBlockNumber: number
    lockedUntilBlockTimestamp: number
    interest: string
    daoTypeHash: string
    udtInfo: UDTInfo
  }

  export interface LockInfo {
    status: 'locked' | 'unlocked'
    epochNumber: string
    epochIndex: string
    estimatedUnlockTime: string
  }

  export interface UDTAccount {
    symbol: string
    decimal: string
    amount: string
    typeHash: string
    udtIconFile: string
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
    udtAccounts: UDTAccount[]
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
    minerReward: string
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
    totalDeposit: string
    depositorsCount: string
    depositChanges: string
    unclaimedCompensationChanges: string
    claimedCompensationChanges: string
    depositorChanges: string
    unclaimedCompensation: string
    claimedCompensation: string
    averageDepositTime: string
    miningReward: string
    depositCompensation: string
    treasuryAmount: string
    estimatedApc: string
  }

  export interface NervosDaoDepositor {
    addressHash: string
    daoDeposit: number
    averageDepositTime: string
  }

  export interface NervosDaoState {
    nervosDao: NervosDao
    transactions: Transaction[]
    transactionsStatus: FetchStatus
    total: number
    depositors: NervosDaoDepositor[]
    status: FetchStatus
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
    totalDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNewDaoDeposit {
    dailyDaoDeposit: string
    dailyDaoDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNewDaoWithdraw {
    dailyDaoWithdraw: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticCirculationRatio {
    circulationRatio: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticDifficultyHashRate {
    difficulty: string
    hashRate: string
    epochNumber: string
  }

  export interface StatisticDifficulty {
    avgDifficulty: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticHashRate {
    avgHashRate: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticUncleRate {
    uncleRate: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticCellCount {
    liveCellsCount: string
    deadCellsCount: string
    allCellsCount: string
    createdAtUnixtimestamp: string
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

  export interface StatisticAddressBalanceDistribution {
    addressBalanceDistribution: string[][]
  }

  export interface StatisticBalanceDistribution {
    balance: string
    addresses: string
    sumAddresses: string
  }

  export interface StatisticTransactionFee {
    totalTxFee: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticBlockTimeDistributions {
    blockTimeDistribution: string[][]
  }

  export interface StatisticBlockTimeDistribution {
    time: string
    ratio: string
  }

  export interface StatisticAverageBlockTime {
    timestamp: number
    avgBlockTimeDaily: string
    avgBlockTimeWeekly: string
  }

  export interface StatisticAverageBlockTimes {
    averageBlockTime: StatisticAverageBlockTime[]
  }

  export interface StatisticOccupiedCapacity {
    occupiedCapacity: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticEpochTimeDistributions {
    epochTimeDistribution: string[][]
  }

  export interface StatisticEpochTimeDistribution {
    time: string
    epoch: string
  }

  export interface StatisticNewNodeCount {
    nodesCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNodeDistribution {
    name: string
    value: number[]
  }

  export interface StatisticNodeDistributions {
    nodesDistribution: {
      city: string
      count: number
      postal: string
      country: string
      latitude: string
      longitude: string
    }[]
  }

  export interface StatisticTotalSupply {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    burnt: string
    lockedCapacity: string
  }

  export interface StatisticAnnualPercentageCompensation {
    year: number
    apc: string
  }

  export interface StatisticAnnualPercentageCompensations {
    nominalApc: string[]
  }

  export interface StatisticSecondaryIssuance {
    createdAtUnixtimestamp: string
    treasuryAmount: string
    miningReward: string
    depositCompensation: string
  }

  export interface StatisticInflationRates {
    nominalApc: string[]
    nominalInflationRate: string[]
    realInflationRate: string[]
  }

  export interface StatisticInflationRate {
    year: number
    nominalApc: string
    nominalInflationRate: string
    realInflationRate: string
  }

  export interface StatisticLiquidity {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    liquidity: string
    daoDeposit: string
  }

  export interface StatisticMinerAddressDistribution {
    minerAddressDistribution: object
  }

  export interface StatisticMinerAddress {
    address: string
    radio: string
  }

  interface FetchStatusValue {
    OK: string
    Error: string
    InProgress: string
    None: string
  }

  export type FetchStatus = keyof FetchStatusValue

  export interface UDT {
    symbol: string
    fullName: string
    totalAmount: string
    addressesCount: string
    decimal: string
    iconFile: string
  }

  export interface UDTState {
    udt: UDT
    transactions: Transaction[]
    total: number
    status: FetchStatus
    filterStatus: FetchStatus
  }

  export interface AddressState {
    address: Address
    transactions: Transaction[]
    total: number
    addressStatus: FetchStatus
    transactionsStatus: FetchStatus
  }

  export interface BlockState {
    block: Block
    transactions: Transaction[]
    total: number
    status: FetchStatus
  }

  export interface BlockListState {
    blocks: Block[]
    total: number
  }

  export interface TransactionState {
    transaction: Transaction
    status: FetchStatus
    scriptFetched: boolean
  }

  export interface TransactionsState {
    transactions: Transaction[]
    total: number
  }

  export interface TokenInfo {
    symbol: string
    fullName: string
    iconFile: string
    published: boolean
    description: string
    totalAmount: string
    addressesCount: string
    decimal: string
    h24CkbTransactionsCount: string
    createdAt: string
    typeHash: string
  }

  export interface TokensState {
    tokens: TokenInfo[]
    status: FetchStatus
  }

  export interface StatisticChartsState {
    statisticDifficultyHashRates: StatisticDifficultyHashRate[]
    statisticDifficultyHashRatesFetchEnd: boolean
    statisticDifficultyUncleRates: StatisticDifficultyUncleRate[]
    statisticDifficultyUncleRatesFetchEnd: boolean
    statisticDifficulties: StatisticDifficulty[]
    statisticDifficultiesFetchEnd: boolean
    statisticHashRates: StatisticHashRate[]
    statisticHashRatesFetchEnd: boolean
    statisticUncleRates: StatisticUncleRate[]
    statisticUncleRatesFetchEnd: boolean
    statisticTransactionCounts: StatisticTransactionCount[]
    statisticTransactionCountsFetchEnd: boolean
    statisticCellCounts: StatisticCellCount[]
    statisticCellCountsFetchEnd: boolean
    statisticTotalDaoDeposits: StatisticTotalDaoDeposit[]
    statisticTotalDaoDepositsFetchEnd: boolean
    statisticNewDaoDeposits: StatisticNewDaoDeposit[]
    statisticNewDaoDepositsFetchEnd: boolean
    statisticNewDaoWithdraw: StatisticNewDaoWithdraw[]
    statisticNewDaoWithdrawFetchEnd: boolean
    statisticAddressCounts: StatisticAddressCount[]
    statisticAddressCountsFetchEnd: boolean
    statisticAddressBalanceRanks: StatisticAddressBalanceRank[]
    statisticAddressBalanceRanksFetchEnd: boolean
    statisticBalanceDistributions: StatisticBalanceDistribution[]
    statisticBalanceDistributionsFetchEnd: boolean
    statisticTxFeeHistories: StatisticTransactionFee[]
    statisticTxFeeHistoriesFetchEnd: boolean
    statisticBlockTimeDistributions: StatisticBlockTimeDistribution[]
    statisticBlockTimeDistributionsFetchEnd: boolean
    statisticAverageBlockTimes: StatisticAverageBlockTime[]
    statisticAverageBlockTimesFetchEnd: boolean
    statisticOccupiedCapacities: StatisticOccupiedCapacity[]
    statisticOccupiedCapacitiesFetchEnd: boolean
    statisticEpochTimeDistributions: StatisticEpochTimeDistribution[]
    statisticEpochTimeDistributionsFetchEnd: boolean
    statisticCirculationRatios: StatisticCirculationRatio[]
    statisticCirculationRatiosFetchEnd: boolean
    statisticNewNodeCounts: StatisticNewNodeCount[]
    statisticNewNodeCountsFetchEnd: boolean
    statisticNodeDistributions: StatisticNodeDistribution[]
    statisticNodeDistributionsFetchEnd: boolean
    statisticTotalSupplies: StatisticTotalSupply[]
    statisticTotalSuppliesFetchEnd: boolean
    statisticAnnualPercentageCompensations: StatisticAnnualPercentageCompensation[]
    statisticAnnualPercentageCompensationsFetchEnd: boolean
    statisticSecondaryIssuance: StatisticSecondaryIssuance[]
    statisticSecondaryIssuanceFetchEnd: boolean
    statisticInflationRates: StatisticInflationRate[]
    statisticInflationRatesFetchEnd: boolean
    statisticLiquidity: StatisticLiquidity[]
    statisticLiquidityFetchEnd: boolean
    statisticMinerAddresses: StatisticMinerAddress[]
    statisticMinerAddressesFetchEnd: boolean
  }

  export interface PageState extends StatisticChartsState {
    addressState: AddressState
    blockState: BlockState
    homeBlocks: Block[]
    blockListState: BlockListState
    transactionState: TransactionState
    transactionsState: TransactionsState
    statistics: Statistics
    nervosDaoState: NervosDaoState
    udtState: UDTState
    tokensState: TokensState
  }

  export interface PagePayload
    extends PageState,
      AddressState,
      BlockState,
      BlockListState,
      TransactionState,
      TransactionsState,
      NervosDaoState,
      UDTState,
      TokensState {}

  export interface App {
    toast: ToastMessage | null
    loading: boolean
    secondLoading: boolean
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

  export interface AppPayload extends App, ToastMessage {
    appError: AppError
  }

  export interface Components {
    searchBarEditable: boolean
    filterNoResult: boolean
    mobileMenuVisible: boolean
    headerSearchBarVisible: boolean
  }

  export interface AppState extends PageState {
    app: App
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

declare namespace Response {
  export interface Response<T> {
    data: T
    meta?: Meta
    error?: Error[]
  }

  export interface Error {
    id: string
    code: number
    status: number
    title: string
    detail: string
    href: string
  }

  export interface Meta {
    total: number
    pageSize: number
  }

  export interface Wrapper<T> {
    id: number
    type: string
    attributes: T
  }
}
