import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import browserHistory from '../../routes/history'

const NetworkError = i18n.t('toast.invalid_network')

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
    error => {
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
