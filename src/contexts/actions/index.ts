export enum AppActions {
  ResizeWindow = 'resizeWindow',
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateTipBlockNumber = 'updateTipBlockNumber',
  UpdateAppLanguage = 'updateAppLanguage',
  UpdateHardForkStatus = 'updateHardForkStatus',
}

export enum PageActions {
  UpdateStatistics = 'updateStatistics',

  UpdateStatisticTotalDaoDeposit = 'updateStatisticTotalDaoDeposit',
  UpdateStatisticTotalDaoDepositFetchEnd = 'updateStatisticTotalDaoDepositFetchEnd',
  UpdateStatisticNewDaoWithdraw = 'updateStatisticNewDaoWithdraw',
  UpdateStatisticNewDaoWithdrawFetchEnd = 'updateStatisticNewDaoWithdrawFetchEnd',
  UpdateStatisticEpochLengthDistribution = 'updateStatisticEpochLengthDistribution',
  UpdateStatisticEpochLengthDistributionFetchEnd = 'updateStatisticEpochLengthDistributionFetchEnd',
  UpdateStatisticNewNodeCount = 'updateStatisticNewNodeCount',
  UpdateStatisticNewNodeCountFetchEnd = 'updateStatisticNewNodeCountFetchEnd',
  UpdateStatisticNodeDistribution = 'updateStatisticNodeDistribution',
  UpdateStatisticNodeDistributionFetchEnd = 'updateStatisticNodeDistributionFetchEnd',
}

export enum ComponentActions {
  UpdateHeaderSearchEditable = 'updateHeaderSearchEditable',
  UpdateHeaderMobileMenuVisible = 'updateHeaderMobileMenuVisible',
  UpdateHeaderSearchBarVisible = 'updateHeaderSearchBarVisible',
  UpdateMaintenanceAlertVisible = 'updateMaintenanceAlertVisible',
}

export type StateActions = AppActions | PageActions | ComponentActions

// eslint-disable-next-line no-undef
export default StateActions
