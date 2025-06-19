import ReactDOM from 'react-dom'
// This should be after all third-party library styles so that it can override them.
import './index.css'
import './styles/index.css'
import './utils/i18n'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { handleRedirectFromAggron } from './utils/util'
import { initSentry } from './utils/error'

const { REACT_APP_SENTRY_DSN } = process.env
if (REACT_APP_SENTRY_DSN) {
  initSentry(REACT_APP_SENTRY_DSN)
}

const redirect = handleRedirectFromAggron()
if (!redirect) {
  ReactDOM.render(<App />, document.getElementById('root'))

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
}
