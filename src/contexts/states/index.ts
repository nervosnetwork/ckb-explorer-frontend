import initApp from './app'
import initStatistics from './statistics'
import initComponents from './components'
import initStatisticChartsState from './charts'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  statistics: initStatistics,
  ...initStatisticChartsState,

  components: initComponents,
}

export default initState
