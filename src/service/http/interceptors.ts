import { AxiosError } from 'axios'
import { History } from 'history'
import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'

const updateNetworkError = (dispatch: AppDispatch, occurError: boolean) => {
  dispatch({
    type: AppActions.UpdateAppErrors,
    payload: {
      appError: {
        type: 'Network',
        message: occurError ? [i18n.t('toast.invalid_network')] : [],
      },
    },
  })
}

export const initAxiosInterceptors = (dispatch: AppDispatch, history: History) => {
  axiosIns.interceptors.request.use(
    config => {
      if (config.method === 'get') {
        // eslint-disable-next-line no-param-reassign
        config.data = {
          unused: 0,
        }
      }
      return config
    },
    error => Promise.reject(error),
  )

  axiosIns.interceptors.response.use(
    response => {
      updateNetworkError(dispatch, false)
      return response
    },
    (error: AxiosError) => {
      updateNetworkError(dispatch, true)
      if (error && error.response && error.response.data) {
        const { message }: { message: string } = error.response.data
        switch (error.response.status) {
          case 503:
            updateNetworkError(dispatch, false)
            if (message) {
              dispatch({
                type: AppActions.UpdateAppErrors,
                payload: {
                  appError: {
                    type: 'Maintain',
                    message: [message],
                  },
                },
              })
            }
            history.replace('/maintain')
            break
          case 422:
          case 404:
          case 400:
            updateNetworkError(dispatch, false)
            break
          default:
            updateNetworkError(dispatch, true)
            break
        }
      }
      return Promise.reject(error)
    },
  )
}

export default initAxiosInterceptors
