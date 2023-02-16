import { ComponentActions } from '../actions'

export const componentReducer = (
  state: State.AppState,
  { type, payload }: { type: ComponentActions; payload: State.Components },
): State.AppState => {
  switch (type) {
    case ComponentActions.UpdateHeaderMobileMenuVisible:
      return {
        ...state,
        components: {
          ...state.components,
          mobileMenuVisible: payload.mobileMenuVisible,
        },
      }
    case ComponentActions.UpdateHeaderSearchBarVisible:
      return {
        ...state,
        components: {
          ...state.components,
          headerSearchBarVisible: payload.headerSearchBarVisible,
        },
      }
    case ComponentActions.UpdateMaintenanceAlertVisible:
      return {
        ...state,
        components: {
          ...state.components,
          maintenanceAlertVisible: payload.maintenanceAlertVisible,
        },
      }
    default:
      return state
  }
}

export default componentReducer
