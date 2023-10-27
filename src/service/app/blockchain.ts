import { explorerService } from '../../services/ExplorerService'
import { setChainAlerts } from '../../components/Sheet'

const ALERT_TO_FILTER_OUT = 'CKB v0.105.* have bugs. Please upgrade to the latest version.'

export const handleBlockchainAlert = () => {
  explorerService.api.fetchBlockchainInfo().then(wrapper => {
    const alerts = wrapper?.attributes.blockchainInfo.alerts ?? []
    setChainAlerts(alerts.map(alert => alert.message).filter(msg => msg !== ALERT_TO_FILTER_OUT))
  })
}

export default {
  handleBlockchainAlert,
}
