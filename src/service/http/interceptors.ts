import { AxiosError } from 'axios'
import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import browserHistory from '../../routes/history'
import { lastPathOfUrl } from '../../utils/uri'
import { HttpErrorCode } from '../../utils/const'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'

const NetworkError = i18n.t('toast.invalid_network')

const urlParam = (error: AxiosError) => {
  if (error.config.params && error.config.params.q) {
    return error.config.params.q
  }
  if (error.config.url) {
    return lastPathOfUrl(error.config.url)
  }
  return undefined
}

const updateNetworkError = (dispatch: AppDispatch, occurError: boolean) => {
  dispatch({
    type: AppActions.UpdateAppErrors,
    payload: {
      appError: {
        type: 'Network',
        message: occurError ? [NetworkError] : [],
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
          case 422:
            updateNetworkError(dispatch, false)
            break
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
          case 404:
            updateNetworkError(dispatch, false)
            if (error.response && error.response.data && Array.isArray(error.response.data)) {
              if (
                (error.response.data as Response.Error[]).find((errorData: Response.Error) => {
                  return errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS
                })
              ) {
                if (urlParam(error)) {
                  browserHistory.push(`/address/${urlParam(error)}`)
                }
              }
            }
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
