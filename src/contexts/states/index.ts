import initApp from './app'
import initStatistics from './statistics'
import initComponents from './components'
import initNervosDaoState from './nervosDao'
import initStatisticChartsState from './charts'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  statistics: initStatistics,
  nervosDaoState: initNervosDaoState,
  ...initStatisticChartsState,

  components: initComponents,
}

export default initState
