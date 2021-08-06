import { createContext, useReducer, useContext } from 'react'
import initState from '../states/index'
import { AppDispatch, reducer } from '../reducer'

export const AppContext = createContext<{ state: typeof initState; dispatch: AppDispatch }>({
  state: initState,
  dispatch: () => {},
})

const withProviders = (Comp: React.ComponentType) => (props: React.Props<any>) => {
  const [providers, dispatch] = useReducer(reducer, initState)

  return (
    <AppContext.Provider
      value={{
        state: providers,
        dispatch,
      }}
    >
      <Comp {...props} />
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext).state
export const useDispatch = () => useContext(AppContext).dispatch

export default withProviders
