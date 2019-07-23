import { triggerAddress } from '../../service/app/address'
import { triggerTransactionByHash } from '../../service/app/transaction'
import { triggerBlock, triggerBlocks, triggerLatestBlocks } from '../../service/app/block'
import { triggerStatistics } from '../../service/app/statistics'

export enum AppActions {
  ResizeWindow = 'resizeWindow',
  UpdateLoading = 'updateLoading',
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateNodeVersion = 'updateNodeVersion',
}

export enum PageActions {
  TriggerAddress = 'triggerAddress',
  UpdateAddress = 'updateAddress',
  UpdateAddressTransactions = 'updateAddressTransactions',
  UpdateAddressTotal = 'updateAddressTotal',

  TriggerHome = 'triggerHome',
  UpdateHomeBlocks = 'updateHomeBlocks',

  TriggerBlockList = 'triggerBlockList',
  UpdateBlockList = 'updateBlockList',
  UpdateBlockListTotal = 'updateBlockListTotal',

  TriggerBlock = 'triggerBlock',
  UpdateBlock = 'updateBlock',
  UpdateBlockTransactions = 'updateBlockTransactions',
  UpdateBlockTotal = 'updateBlockTotal',
  UpdateBlockPrev = 'updateBlockPrev',
  UpdateBlockNext = 'updateBlockNext',

  TriggerTransaction = 'triggerTransaction',
  UpdateTransaction = 'updateTransaction',
  UpdateTipBlockNumber = 'updateTipBlockNumber',

  UpdateStatistics = 'updateStatistics',
}

export enum ComponentActions {
  HeaderHeight = 'headerHeight',
  HaveSearchBar = 'haveSearchBar',

  CellScript = 'cellScript',
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
            text: payload.text,
            timeout: payload.timeout,
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

    // PageActions
    case PageActions.TriggerHome:
      triggerLatestBlocks(payload.dispatch)
      triggerStatistics(payload.dispatch)
      return state
    case PageActions.UpdateHomeBlocks:
      return {
        ...state,
        homeBlocks: payload.homeBlocks,
      }

    case PageActions.TriggerBlockList:
      triggerBlocks(payload)
      return state
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

    case PageActions.TriggerAddress:
      triggerAddress(payload)
      return state
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

    case PageActions.TriggerBlock:
      triggerBlock(payload)
      return state
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
    case PageActions.UpdateBlockPrev:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          prev: payload.prev,
        },
      }
    case PageActions.UpdateBlockNext:
      return {
        ...state,
        blockState: {
          ...state.blockState,
          next: payload.next,
        },
      }

    case PageActions.TriggerTransaction:
      triggerTransactionByHash(payload)
      return state
    case PageActions.UpdateTransaction:
      return {
        ...state,
        transaction: payload.transaction,
      }
    case PageActions.UpdateTipBlockNumber:
      return {
        ...state,
        tipBlockNumber: payload.tipBlockNumber,
      }
    case PageActions.UpdateStatistics:
      return {
        ...state,
        statistics: payload.statistics,
      }

    case ComponentActions.HeaderHeight:
      return {
        ...state,
        header: {
          ...state.header,
          normalHeight: payload.normalHeight,
        },
      }
    case ComponentActions.HaveSearchBar:
      return {
        ...state,
        header: {
          ...state.header,
          haveSearchBar: payload.haveSearchBar,
        },
      }
    case ComponentActions.CellScript:
      return {
        ...state,
        cellState: {
          ...state.cellState,
          scriptState: payload.scriptState,
        },
      }
    default:
      return state
  }
}
