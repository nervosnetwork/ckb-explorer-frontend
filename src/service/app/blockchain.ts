import { fetchBlockchainInfo } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'

const alertNotEmpty = (wrapper: Response.Wrapper<State.BlockchainInfo> | null): boolean =>
  wrapper !== null &&
  wrapper !== undefined &&
  wrapper.attributes &&
  wrapper.attributes.blockchainInfo &&
  wrapper.attributes.blockchainInfo.alerts &&
  wrapper.attributes.blockchainInfo.alerts.length > 0

const ALERT_TO_FILTER_OUT = 'CKB v0.105.* have bugs. Please upgrade to the latest version.'

export const handleBlockchainAlert = (dispatch: AppDispatch) => {
  fetchBlockchainInfo().then((wrapper: Response.Wrapper<State.BlockchainInfo> | null) => {
    if (alertNotEmpty(wrapper)) {
      dispatch({
        type: AppActions.UpdateAppErrors,
        payload: {
          appError: {
            type: 'ChainAlert',
            message: wrapper!.attributes.blockchainInfo.alerts
              .map(alert => alert.message)
              .filter(msg => msg !== ALERT_TO_FILTER_OUT),
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
