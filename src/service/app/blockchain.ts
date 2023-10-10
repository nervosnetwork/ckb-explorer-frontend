import { explorerService, Response } from '../../services/ExplorerService'
import { setChainAlerts } from '../../components/Sheet'

const alertNotEmpty = (wrapper: Response.Wrapper<State.BlockchainInfo> | null): boolean =>
  wrapper !== null &&
  wrapper !== undefined &&
  wrapper.attributes &&
  wrapper.attributes.blockchainInfo &&
  wrapper.attributes.blockchainInfo.alerts &&
  wrapper.attributes.blockchainInfo.alerts.length > 0

const ALERT_TO_FILTER_OUT = 'CKB v0.105.* have bugs. Please upgrade to the latest version.'

export const handleBlockchainAlert = () => {
  explorerService.api.fetchBlockchainInfo().then((wrapper: Response.Wrapper<State.BlockchainInfo> | null) => {
    if (alertNotEmpty(wrapper)) {
      setChainAlerts(
        wrapper!.attributes.blockchainInfo.alerts
          .map(alert => alert.message)
          .filter(msg => msg !== ALERT_TO_FILTER_OUT),
      )
    } else {
      setChainAlerts([])
    }
  })
}

export default {
  handleBlockchainAlert,
}
