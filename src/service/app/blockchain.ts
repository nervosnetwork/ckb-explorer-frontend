import { fetchBlockchainInfo } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'

const alertNotEmpty = (wrapper: Response.Wrapper<State.BlockchainInfo> | null): boolean => {
  return (
    wrapper !== null &&
    wrapper !== undefined &&
    wrapper.attributes &&
    wrapper.attributes.blockchainInfo &&
    wrapper.attributes.blockchainInfo.alerts &&
    wrapper.attributes.blockchainInfo.alerts.length > 0
  )
}

export const handleBlockchainAlert = (dispatch: AppDispatch) => {
  fetchBlockchainInfo().then((wrapper: Response.Wrapper<State.BlockchainInfo> | null) => {
    if (alertNotEmpty(wrapper)) {
      dispatch({
        type: AppActions.UpdateAppErrors,
        payload: {
          appError: {
            type: 'ChainAlert',
            message: wrapper!.attributes.blockchainInfo.alerts.map(alert => {
              return alert.message
            }),
          },
        },
      })
    } else {
      dispatch({
        type: AppActions.UpdateAppErrors,
        payload: {
          appError: {
            type: 'ChainAlert',
            message: [],
          },
        },
      })
    }
  })
}

export default {
  handleBlockchainAlert,
}
