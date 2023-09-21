import React from 'react'
import StateActions, { ComponentActions } from '../actions'
import componentReducer from './component'

export type AppDispatch = React.Dispatch<{ type: StateActions; payload: any }> // TODO: add type of payload
export type StateWithDispatch = State.AppState & { dispatch: AppDispatch }

export const reducer = (
  state: State.AppState,
  { type, payload }: { type: StateActions; payload: any },
): State.AppState => {
  return componentReducer(state, {
    type: type as ComponentActions,
    payload,
  })
}
