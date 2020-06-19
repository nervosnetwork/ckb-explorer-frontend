import { ComponentActions } from '../actions'

export const componentReducer = (
  state: State.AppState,
  { type, payload }: { type: ComponentActions; payload: State.Components },
): State.AppState => {
  switch (type) {
    case ComponentActions.UpdateHeaderSearchEditable:
      return {
        ...state,
        components: {
          ...state.components,
          searchBarEditable: payload.searchBarEditable,
        },
      }
    case ComponentActions.UpdateFilterNoResult:
      return {
        ...state,
        components: {
          ...state.components,
          filterNoResult: payload.filterNoResult,
        },
      }
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
    default:
      return state
  }
}

export default componentReducer
