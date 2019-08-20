import initApp from './app'
import initAddressState from './address'
import { initBlockState, initBlockListState } from './block'
import initStatistics from './statistics'
import initTransaction from './transaction'
import initComponents from './components'

export type FetchStatus = keyof State.FetchStatus

const initHomeBlocks = [] as State.Block[]
const initStatisticsChartDatas = [] as State.StatisticsChartData[]

const initState: State.AppState = {
  app: initApp,
  blockState: initBlockState,
  blockListState: initBlockListState,
  addressState: initAddressState,
  transaction: initTransaction,
  statistics: initStatistics,
  statisticsChartDatas: initStatisticsChartDatas,
  homeBlocks: initHomeBlocks,

  components: initComponents,
}

export default initState
