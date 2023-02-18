export enum AppActions {
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateTipBlockNumber = 'updateTipBlockNumber',
  UpdateAppLanguage = 'updateAppLanguage',
  UpdateHardForkStatus = 'updateHardForkStatus',
}

export enum PageActions {
  UpdateStatistics = 'updateStatistics',
}

export enum ComponentActions {
  UpdateHeaderMobileMenuVisible = 'updateHeaderMobileMenuVisible',
  UpdateHeaderSearchBarVisible = 'updateHeaderSearchBarVisible',
  UpdateMaintenanceAlertVisible = 'updateMaintenanceAlertVisible',
}

export type StateActions = AppActions | PageActions | ComponentActions

// eslint-disable-next-line no-undef
export default StateActions
