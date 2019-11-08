import { createBrowserHistory } from 'history'
import CONFIG from '../config'

export default createBrowserHistory({
  basename: `/${CONFIG.CHAIN_NAME}`,
})
