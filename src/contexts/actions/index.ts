export enum AppActions {
  ResizeWindow = 'resizeWindow',
  UpdateLoading = 'updateLoading',
  UpdateSecondLoading = 'updateSecondLoading',
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateNodeVersion = 'updateNodeVersion',
  UpdateTipBlockNumber = 'updateTipBlockNumber',
  UpdateAppLanguage = 'updateAppLanguage',
}

export enum PageActions {
  UpdateAddress = 'updateAddress',
  UpdateAddressTransactions = 'updateAddressTransactions',
  UpdateAddressTotal = 'updateAddressTotal',
  UpdateAddressStatus = 'updateAddressStatus',
  UpdateAddressTransactionsStatus = 'updateAddressTransactionsStatus',

  UpdateHomeBlocks = 'updateHomeBlocks',

  UpdateBlockList = 'updateBlockList',
  UpdateBlockListTotal = 'updateBlockListTotal',

  UpdateBlock = 'updateBlock',
  UpdateBlockTransactions = 'updateBlockTransactions',
  UpdateBlockTotal = 'updateBlockTotal',
  UpdateBlockStatus = 'updateBlockStatus',

  UpdateTransaction = 'updateTransaction',
  UpdateTransactionStatus = 'updateTransactionStatus',
  UpdateTransactionScriptFetched = 'updateTransactionScriptFetched',
  UpdateTransactions = 'updateTransactions',
  UpdateTransactionsTotal = 'updateTransactionsTotal',

  UpdateStatistics = 'updateStatistics',

  UpdateStatisticDifficultyHashRate = 'updateStatisticDifficultyHashRate',
  UpdateStatisticDifficultyUncleRate = 'updateStatisticDifficultyUncleRate',
  UpdateStatisticDifficulty = 'updateStatisticDifficulty',
  UpdateStatisticHashRate = 'updateStatisticHashRate',
  UpdateStatisticUncleRate = 'updateStatisticUncleRate',
  UpdateStatisticTransactionCount = 'updateStatisticTransactionCount',
  UpdateStatisticAddressCount = 'updateStatisticAddressCount',
  UpdateStatisticTotalDaoDeposit = 'updateStatisticTotalDaoDeposit',
  UpdateStatisticNewDaoDeposit = 'updateStatisticNewDaoDeposit',
  UpdateStatisticNewDaoWithdraw = 'updateStatisticNewDaoWithdraw',
  UpdateStatisticCirculationRatio = 'updateStatisticCirculationRatio',
  UpdateStatisticCellCount = 'updateStatisticCellCount',
  UpdateStatisticAddressBalanceRank = 'updateStatisticAddressBalanceRank',
  UpdateStatisticBalanceDistribution = 'updateStatisticBalanceDistribution',
  UpdateStatisticTxFeeHistory = 'updateStatisticTxFeeHistory',
  UpdateStatisticBlockTimeDistribution = 'updateStatisticBlockTimeDistribution',
  UpdateStatisticAverageBlockTime = 'updateStatisticAverageBlockTime',
  UpdateStatisticOccupiedCapacity = 'updateStatisticOccupiedCapacity',
  UpdateStatisticEpochTimeDistribution = 'updateStatisticEpochTimeDistribution',
  UpdateStatisticEpochLengthDistribution = 'updateStatisticEpochLengthDistribution',
  UpdateStatisticNewNodeCount = 'updateStatisticNewNodeCount',
  UpdateStatisticNodeDistribution = 'updateStatisticNodeDistribution',
  UpdateStatisticTotalSupply = 'updateStatisticTotalSupply',
  UpdateStatisticAnnualPercentageCompensation = 'UpdateStatisticAnnualPercentageCompensation',
  UpdateStatisticSecondaryIssuance = 'updateStatisticSecondaryIssuance',
  UpdateStatisticInflationRate = 'updateStatisticInflationRate',
  UpdateStatisticLiquidity = 'updateStatisticLiquidity',
  UpdateStatisticMinerAddressDistribution = 'updateStatisticMinerAddressDistribution',

  UpdateNervosDao = 'updateNervosDao',
  UpdateNervosDaoTransactions = 'updateNervosDaoTransactions',
  UpdateNervosDaoTransactionsStatus = 'updateNervosDaoTransactionsStatus',
  UpdateNervosDaoTransactionsTotal = 'updateNervosDaoTransactionsTotal',
  UpdateNervosDaoDepositors = 'updateNervosDaoDepositors',
  UpdateNervosDaoStatus = 'updateNervosDaoStatus',

  UpdateUDT = 'updateUDT',
  UpdateUDTTransactions = 'updateUDTTransactions',
  UpdateUDTTransactionsTotal = 'updateUDTTransactionsTotal',
  UpdateUDTStatus = 'updateUDTStatus',

  UpdateTokens = 'updateTokens',
  UpdateTokensStatus = 'updateTokensStatus'
}

export enum ComponentActions {
  UpdateHeaderSearchEditable = 'updateHeaderSearchEditable',
  UpdateHeaderMobileMenuVisible = 'updateHeaderMobileMenuVisible',
  UpdateHeaderSearchBarVisible = 'updateHeaderSearchBarVisible',
}

export type StateActions = AppActions | PageActions | ComponentActions

export default StateActions
