import initApp from './app'
import initComponents from './components'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  components: initComponents,
}

export default initState
