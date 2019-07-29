import React, { createContext, useReducer } from 'react'
import initState from '../states/index'
import { AppDispatch, reducer } from './reducer'

export const AppContext = createContext<typeof initState>(initState)

const withProviders = (Comp: React.ComponentType<{ dispatch: AppDispatch }>) => (props: React.Props<any>) => {
  const [providers, dispatch] = useReducer(reducer, initState)

  return (
    <AppContext.Provider value={providers}>
      <Comp {...props} dispatch={dispatch} />
    </AppContext.Provider>
  )
}

export default withProviders
