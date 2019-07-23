import initApp from './app'
import initAddressState from './address'
import { initBlockState, initBlockListState } from './block'
import initStatistics from './statistics'
import initTransaction from './transaction'
import initHeader from './components/header'
import initCell from './components/cell'
import initSearch from './components/search'

const initHomeBlocks = [] as Response.Wrapper<State.Block>[]

const initState: State.AppState = {
  app: initApp,
  blockState: initBlockState,
  blockListState: initBlockListState,
  addressState: initAddressState,
  transaction: initTransaction,
  statistics: initStatistics,
  homeBlocks: initHomeBlocks,
  tipBlockNumber: 0,

  header: initHeader,
  cellState: initCell,
  search: initSearch,
}

export default initState
