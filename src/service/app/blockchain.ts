import { fetchBlockchainInfo } from '../http/fetcher'

const alertNotEmpty = (response: Response.Wrapper<State.BlockchainInfo>): boolean => {
  return (
    response &&
    response.attributes &&
    response.attributes.blockchain_info &&
    response.attributes.blockchain_info.alerts &&
    response.attributes.blockchain_info.alerts.length > 0
  )
}

export const handleBlockchainAlert = (appContext: any) => {
  fetchBlockchainInfo().then((response: Response.Wrapper<State.BlockchainInfo>) => {
    if (alertNotEmpty(response)) {
      appContext.updateAppErrors({
        type: 'ChainAlert',
        message: response.attributes.blockchain_info.alerts.map(alert => {
          return alert.message
        }),
      })
    } else {
      appContext.updateAppErrors({
        type: 'ChainAlert',
        message: [],
      })
    }
  })
}

export default {
  handleBlockchainAlert,
}
