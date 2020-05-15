import { AppActions } from '../actions'

export const appReducer = (
  state: State.AppState,
  { type, payload }: { type: AppActions; payload: State.AppPayload },
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
    case AppActions.UpdateSecondLoading:
      return {
        ...state,
        app: {
          ...state.app,
          secondLoading: payload.secondLoading,
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
            type: payload.type,
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
    default:
      return state
  }
}

export default appReducer
