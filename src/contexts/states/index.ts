import initApp from './app'
import initAddressState from './address'
import { initBlockState, initBlockListState } from './block'
import initStatistics from './statistics'
import { initTransactionState } from './transaction'
import initComponents from './components'
import initNervosDaoState from './nervosDao'
import initStatisticChartsState from './charts'
import initUDTState from './udt'
import initTokensState from './tokens'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  app: initApp,
  blockState: initBlockState,
  blockListState: initBlockListState,
  addressState: initAddressState,
  transactionState: initTransactionState,
  statistics: initStatistics,
  nervosDaoState: initNervosDaoState,
  ...initStatisticChartsState,
  udtState: initUDTState,
  tokensState: initTokensState,

  components: initComponents,
}

export default initState
