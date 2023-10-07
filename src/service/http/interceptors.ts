import { AxiosError } from 'axios'
import { axiosIns } from './fetcher'
import i18n from '../../utils/i18n'
import { setNetworkErrMsgs } from '../../components/Sheet'

let timeout: ReturnType<typeof setTimeout> | null

const updateNetworkError = (errMessage = 'toast.invalid_network') => {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    setNetworkErrMsgs([])
    timeout = null
  }, 2000)
  setNetworkErrMsgs([i18n.t(errMessage)])
}

export const initAxiosInterceptors = () => {
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
    response => response,
    (error: AxiosError) => {
      if (error && error.response && error.response.data) {
        const { message }: { message: string } = error.response.data
        switch (error.response.status) {
          case 503:
            updateNetworkError(message || undefined)
            break
          case 422:
          case 404:
          case 400:
            break
          case 429:
            updateNetworkError('toast.too_many_request')
            break
          default:
            updateNetworkError()
            break
        }
      } else {
        updateNetworkError()
      }
      return Promise.reject(error)
    },
  )
}

export default initAxiosInterceptors
