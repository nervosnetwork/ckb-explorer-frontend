export enum AppActions {
  ResizeWindow = 'resizeWindow',
  UpdateLoading = 'updateLoading',
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

  UpdateHomeBlocks = 'updateHomeBlocks',

  UpdateBlockList = 'updateBlockList',
  UpdateBlockListTotal = 'updateBlockListTotal',

  UpdateBlock = 'updateBlock',
  UpdateBlockTransactions = 'updateBlockTransactions',
  UpdateBlockTotal = 'updateBlockTotal',

  UpdateTransaction = 'updateTransaction',

  UpdateStatistics = 'updateStatistics',

  UpdateStatisticsChartData = 'updateStatisticsChartData',
}

export enum ComponentActions {
  UpdateHeaderSearchEditable = 'updateHeaderSearchEditable',
}

export type StateActions = AppActions | PageActions | ComponentActions

export type AppDispatch = React.Dispatch<{ type: StateActions; payload: any }> // TODO: add type of payload
export type StateWithDispatch = State.AppState & { dispatch: AppDispatch }

export const reducer = (
  state: State.AppState,
  { type, payload }: { type: StateActions; payload: any },
): State.AppState => {
  switch (type) {
    case AppActions.ResizeWindow:
      return {
        ...state,
        app: {
          ...state.app,
          appWidth: payload.appWidth,
          appHeight: payload.appHeight,
        },
      }
    case AppActions.UpdateLoading:
      return {
        ...state,
        app: {
          ...state.app,
          loading: payload.loading,
        },
      }
    case AppActions.UpdateModal:
      return {
        ...state,
        app: {
          ...state.app,
        },
      }
    case AppActions.ShowToastMessage:
      return {
        ...state,
        app: {
          ...state.app,
          toast: {
            id: new Date().getTime(),
            message: payload.message,
            duration: payload.duration,
          },
        },
      }
    case AppActions.UpdateAppErrors:
      return {
        ...state,
        app: {
          ...state.app,
          appErrors: state.app.appErrors.map((error: State.AppError) => {
            if (payload.appError.type === error.type) {
              return payload.appError
            }
            return error
          }) as typeof state.app.appErrors,
        },
      }
    case AppActions.UpdateNodeVersion:
      return {
        ...state,
        app: {
          ...state.app,
          nodeVersion: payload.nodeVersion,
        },
      }
    case AppActions.UpdateTipBlockNumber:
      return {
        ...state,
        app: {
          ...state.app,
          tipBlockNumber: payload.tipBlockNumber,
        },
      }
    case AppActions.UpdateAppLanguage:
      return {
        ...state,
        app: {
          ...state.app,
          language: payload.language,
        },
      }

    // PageActions
    case PageActions.UpdateHomeBlocks:
      return {
        ...state,
        homeBlocks: payload.homeBlocks,
      }

    case PageActions.UpdateBlockList:
      return {
        ...state,
        blockListState: {
          ...state.blockListState,
          blocks: payload.blocks,
        },
      }
    case PageActions.UpdateBlockListTotal:
      return {
        ...state,
        blockListState: {
          ...state.blockListState,
          total: payload.total,
        },
      }

    case PageActions.UpdateAddress:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          address: payload.address,
        },
      }
    case PageActions.UpdateAddressTransactions:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateAddressTotal:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          total: payload.total,
        },
      }
    case PageActions.UpdateAddressStatus:
      return {
        ...state,
        addressState: {
          ...state.addressState,
          status: payload.status,
        },
      }

    case PageActions.UpdateBlock:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          block: payload.block,
        },
      }
    case PageActions.UpdateBlockTransactions:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          transactions: payload.transactions,
        },
      }
    case PageActions.UpdateBlockTotal:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          total: payload.total,
        },
      }

    case PageActions.UpdateTransaction:
      return {
        ...state,
        transaction: payload.transaction,
      }
    case PageActions.UpdateStatistics:
      return {
        ...state,
        statistics: payload.statistics,
      }
    case PageActions.UpdateStatisticsChartData:
      return {
        ...state,
        statisticsChartDatas: payload.statisticsChartDatas,
      }
    case ComponentActions.UpdateHeaderSearchEditable:
      return {
        ...state,
        components: {
          searchBarEditable: payload.searchBarEditable,
        },
      }
    default:
      return state
  }
}
