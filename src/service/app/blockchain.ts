import { fetchBlockchainInfo } from '../http/fetcher'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'

const alertNotEmpty = (wrapper: Response.Wrapper<State.BlockchainInfo> | null): boolean => {
  return (
    wrapper !== null &&
    wrapper !== undefined &&
    wrapper.attributes &&
    wrapper.attributes.blockchain_info &&
    wrapper.attributes.blockchain_info.alerts &&
    wrapper.attributes.blockchain_info.alerts.length > 0
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
            message: wrapper!.attributes.blockchain_info.alerts.map(alert => {
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

export const getChainType = (dispatch: AppDispatch) => {
  fetchBlockchainInfo().then((wrapper: Response.Wrapper<State.BlockchainInfo> | null) => {
    if (wrapper && wrapper.attributes.blockchain_info) {
      dispatch({
        type: AppActions.UpdateChainType,
        payload: {
          chainType: wrapper.attributes.blockchain_info.chain,
        },
      })
    }
  })
}

export default {
  handleBlockchainAlert,
  getChainType,
}
