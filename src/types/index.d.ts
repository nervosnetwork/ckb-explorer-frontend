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
    type: 'Network' | 'ChainAlert' | 'Maintenance'
    message: string[]
  }

  type CellTypes =
    | 'normal'
    | 'nervos_dao_deposit'
    | 'nervos_dao_withdrawing'
    | 'udt'
    | 'm_nft_issuer'
    | 'm_nft_class'
    | 'm_nft_token'
    | 'nrc_721_token'
    | 'cota_registry'
    | 'cota_regular'

  interface UDTInfo {
    symbol: string
    amount: string
    decimal: string
    typeHash: string
    published: boolean
    uan?: string
  }

  interface NftIssuer {
    issuerName: string
  }

  interface NftClass {
    className: string
    total: string
  }

  interface NftToken {
    className: string
    tokenId: string
    total: string
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
    cellType: CellTypes
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
    cellInfo: CellInfo
    mNftInfo: NftIssuer | NftClass | NftToken
    nrc721TokenInfo: Record<'amount' | 'symbol', string>
    since?: {
      raw: string
      median_timestamp?: string
    }
  }

  export interface CellInfo {
    lock: Script
    type: Script
    data: string
  }

  export interface LockInfo {
    status: 'locked' | 'unlocked'
    epochNumber: string
    epochIndex: string
    estimatedUnlockTime: string
  }

  export interface SUDT {
    symbol: string
    decimal: string
    amount: string
    typeHash: string
    udtIconFile: string
    uan?: string
    udtType: 'sudt'
    collection: undefined
    cota: undefined
  }

  interface MNFT {
    symbol: string
    decimal: string
    amount: string
    typeHash: string
    udtIconFile: string
    udtType: 'm_nft_token'
    uan: undefined
    collection: {
      typeHash: string
    }
    cota: undefined
  }

  interface NRC721 {
    symbol: string
    amount: string // token id in fact
    typeHash: string
    udtIconFile: string // base uri with token id in fact
    udtType: 'nrc_721_token'
    uan: undefined
    collection: {
      typeHash: string
    }
    cota: undefined
  }

  interface CoTA {
    symbol: string
    amount: string
    typeHash: string
    udtIconFile: string // base uri with token id in fact
    udtType: 'cota'
    uan: undefined
    collection: undefined
    cota: {
      cotaId: number
      tokenId: number
    }
  }

  export type UDTAccount = SUDT | MNFT | NRC721 | CoTA

  export interface Address {
    addressHash: string
    lockHash: string
    balance: string
    balanceOccupied: string
    transactionsCount: number
    lockScript: Script
    pendingRewardBlocksCount: number
    type: 'Address' | 'LockHash' | ''
    daoDeposit: number
    interest: number
    daoCompensation: number
    lockInfo: LockInfo
    liveCellsCount: string
    minedBlocksCount: string
    isSpecial: boolean
    specialAddress: string
    udtAccounts: Array<UDTAccount>
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
    minerMessage: string
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
    size: number
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
    txStatus: string
    detailedMessage: string
    bytes: number
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
    reorgStartedAt: string | null
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
    uncleRate: string
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

  export interface StatisticDifficultyUncleRateEpoch {
    epochNumber: string
    epochTime: string
    epochLength: string
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

  export interface StatisticCacheInfo {
    flushCacheInfo: string[]
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
    iconFile: string
    published: boolean
    description: string
    totalAmount: string
    addressesCount: string
    decimal: string
    h24CkbTransactionsCount: string
    createdAt: string
    typeHash: string
    issuerAddress: string
    typeScript: Script
    displayName?: string
    uan?: string
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

  export interface TokensState {
    tokens: UDT[]
    total: number
    status: FetchStatus
  }

  export interface StatisticChartsState {
    statisticDifficultyHashRates: StatisticDifficultyHashRate[]
    statisticDifficultyHashRatesFetchEnd: boolean
    statisticDifficultyUncleRateEpochs: StatisticDifficultyUncleRateEpoch[]
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
    appErrors: [
      { type: 'Network'; message: string[] },
      { type: 'ChainAlert'; message: string[] },
      { type: 'Maintenance'; message: string[] },
    ]
    nodeVersion: string
    tipBlockNumber: number

    appWidth: number
    appHeight: number
    language: 'en' | 'zh'
    primaryColor: string
    secondaryColor: string
    chartColor: {
      areaColor: string
      colors: string[]
      moreColors: string[]
      totalSupplyColors: string[]
      daoColors: string[]
      secondaryIssuanceColors: string[]
      liquidityColors: string[]
    }
  }

  export interface AppPayload extends App, ToastMessage {
    appError: AppError
  }

  export interface Components {
    searchBarEditable: boolean
    filterNoResult: boolean
    mobileMenuVisible: boolean
    headerSearchBarVisible: boolean
    maintenanceAlertVisible: boolean
  }

  export interface AppState extends PageState {
    app: App
    components: Components
  }

  export interface MaintenanceInfo {
    maintenanceInfo: {
      startAt: string
      endAt: string
    }
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
