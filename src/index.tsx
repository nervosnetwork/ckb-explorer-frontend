import ReactDOM from 'react-dom'
import './index.css'
import './utils/i18n'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { AppCachedKeys } from './constants/cache'
import { fetchCachedData } from './utils/cache'
import { handleRedirectFromAggron } from './utils/util'

const hasFinishedHardFork = !!fetchCachedData<{
  hasFinishedHardFork: boolean
}>(AppCachedKeys.HardForkInfo)?.hasFinishedHardFork
handleRedirectFromAggron(hasFinishedHardFork)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
