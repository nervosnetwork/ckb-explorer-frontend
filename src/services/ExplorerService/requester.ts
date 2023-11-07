import axios, { AxiosError } from 'axios'
import { BehaviorSubject } from 'rxjs'
import CONFIG from '../../config'

export const networkErrMsgs$ = new BehaviorSubject<string[]>([])

export const requesterV1 = axios.create({
  baseURL: `${CONFIG.API_URL}/api/v1/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

// TODO: need interceptors?
export const requesterV2 = axios.create({
  baseURL: `${CONFIG.API_URL}/api/v2/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

let timeout: ReturnType<typeof setTimeout> | null

const updateNetworkError = (errMessage = 'toast.invalid_network') => {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    networkErrMsgs$.next([])
    timeout = null
  }, 2000)
  networkErrMsgs$.next([errMessage])
}

requesterV1.interceptors.request.use(
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

requesterV1.interceptors.response.use(
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
