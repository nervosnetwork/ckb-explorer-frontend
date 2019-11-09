import { createBrowserHistory } from 'history'
import CONFIG from '../config'
import { isMainnet } from '../utils/chain'

export default createBrowserHistory({
  basename: isMainnet() ? '/' : `/${CONFIG.TESTNET_NAME}`,
})
