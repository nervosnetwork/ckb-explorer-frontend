import { AxiosError } from 'axios'
import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import browserHistory from '../../routes/history'
import { lastPathOfUrl } from '../../utils/uri'
import { HttpErrorCode } from '../../utils/const'

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

export const initAxiosInterceptors = (appContext: any) => {
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
      appContext.updateAppErrors({
        type: 'Network',
        message: [],
      })
      return response
    },
    (error: AxiosError) => {
      appContext.updateAppErrors({
        type: 'Network',
        message: [NetworkError],
      })
      if (error && error.response && error.response.data) {
        const { message }: { message: string } = error.response.data
        switch (error.response.status) {
          case 422:
            appContext.updateAppErrors({
              type: 'Network',
              message: [],
            })
            break
          case 503:
            appContext.updateAppErrors({
              type: 'Network',
              message: [],
            })
            if (message) {
              appContext.updateAppErrors({
                type: 'Maintain',
                message: [message],
              })
            }
            browserHistory.replace('/maintain')
            break
          case 404:
            if (error.response && error.response.data) {
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
            appContext.updateAppErrors({
              type: 'Network',
              message: [],
            })
            break
          default:
            appContext.updateAppErrors({
              type: 'Network',
              message: [NetworkError],
            })
            break
        }
      }
      return Promise.reject(error)
    },
  )
}

export default initAxiosInterceptors
