import React from 'react'
import StateActions, { AppActions, ComponentActions } from '../actions'
import appReducer from './app'
import componentReducer from './component'

export type AppDispatch = React.Dispatch<{ type: StateActions; payload: any }> // TODO: add type of payload
export type StateWithDispatch = State.AppState & { dispatch: AppDispatch }

export const reducer = (
  state: State.AppState,
  { type, payload }: { type: StateActions; payload: any },
): State.AppState => {
  if (Object.values(AppActions).includes(type as AppActions)) {
    return appReducer(state, {
      type: type as AppActions,
      payload,
    })
  }
  return componentReducer(state, {
    type: type as ComponentActions,
    payload,
  })
}
