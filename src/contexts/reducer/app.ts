import { AppActions } from '../actions'

export const appReducer = (
  state: State.AppState,
  { type, payload }: { type: AppActions; payload: State.AppPayload },
): State.AppState => {
  switch (type) {
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
    default:
      return state
  }
}

export default appReducer
