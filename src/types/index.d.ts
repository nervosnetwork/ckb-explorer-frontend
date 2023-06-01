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
    | 'nft_transfer'
    | 'simple_transfer'
    | 'nft_mint'

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

  export interface TransactionLiteDetails {
    address: string;
    transfers: Transfer[];
  }

  interface Transfer {
    tokenName: string;
    capacity: number;
    transferType: CellTypes;
    compensationStartedBlockNumber: number;
    compensationEndedBlockNumber: number;
    compensationStartedTimestamp: number;
    compensationEndedTimestamp: number;
    interest: number;
    lockedUntilBlockNumber: number;
    lockedUntilBlockTimestamp: number;
    nftId: number | string;
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
    udtAccounts?: Array<UDTAccount>
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
    largestBlockInEpoch: number
    largestBlock: number
    cycles: number | null
    maxCyclesInEpoch: number | null
    maxCycles: number | null
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
    largestTxInEpoch: number
    largestTx: number
    cycles: number | null
    maxCyclesInEpoch: number | null
    maxCycles: number | null
    createTimestamp?: number
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
    minerAddressDistribution: Record<string, string>
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

  export interface AddressState {
    address: Address
    transactions: Transaction[]
    total: number
    addressStatus: FetchStatus
    transactionsStatus: FetchStatus
  }

  export interface PageState {
    statistics: Statistics
  }

  export interface PagePayload extends PageState { }

  export interface App {
    toast: ToastMessage | null
    appErrors: [
      { type: 'Network'; message: string[] },
      { type: 'ChainAlert'; message: string[] },
      { type: 'Maintenance'; message: string[] },
    ]
    tipBlockNumber: number

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
