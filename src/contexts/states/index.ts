import initApp from './app'
import initStatistics from './statistics'
import initComponents from './components'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  statistics: initStatistics,

  components: initComponents,
}

export default initState
