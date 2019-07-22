import { fetchBlockchainInfo } from '../http/fetcher'

const alertNotEmpty = (wrapper: Response.Wrapper<State.BlockchainInfo>): boolean => {
  return (
    wrapper &&
    wrapper.attributes &&
    wrapper.attributes.blockchain_info &&
    wrapper.attributes.blockchain_info.alerts &&
    wrapper.attributes.blockchain_info.alerts.length > 0
  )
}

export const handleBlockchainAlert = (appContext: any) => {
  fetchBlockchainInfo().then((wrapper: Response.Wrapper<State.BlockchainInfo>) => {
    if (alertNotEmpty(wrapper)) {
      appContext.updateAppErrors({
        type: 'ChainAlert',
        message: wrapper.attributes.blockchain_info.alerts.map(alert => {
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
