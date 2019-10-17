import initApp from './app'
import initAddressState from './address'
import { initBlockState, initBlockListState } from './block'
import initStatistics from './statistics'
import initTransactionState from './transaction'
import initComponents from './components'
import initNervosDaoState from './nervos_dao'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  blockState: initBlockState,
  blockListState: initBlockListState,
  addressState: initAddressState,
  transactionState: initTransactionState,
  statistics: initStatistics,
  statisticsChartDatas: [],
  statisticsUncleRates: [],
  homeBlocks: [],
  nervosDaoState: initNervosDaoState,

  components: initComponents,
}

export default initState
