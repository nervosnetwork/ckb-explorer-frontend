import { AxiosError } from 'axios'
import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import browserHistory from '../../routes/history'
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

export const initAxiosInterceptors = (dispatch: AppDispatch) => {
  axiosIns.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    },
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
            browserHistory.replace('/maintain')
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
