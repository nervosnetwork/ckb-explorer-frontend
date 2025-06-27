import { BehaviorSubject } from 'rxjs'
import CONFIG from '../../config'

export const networkErrMsgs$ = new BehaviorSubject<string[]>([])

interface RequesterRequestConfig {
  method?: string
  url?: string
  baseURL?: string
  headers?: Record<string, string>
  data?: any
  params?: Record<string, any>
}

interface RequesterResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: RequesterRequestConfig
}

export interface RequestError<T = any> extends Error {
  response?: RequesterResponse<T>
  config: RequesterRequestConfig
  isRequestError: true
}

class FetchClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(config: { baseURL: string; headers?: Record<string, string> }) {
    this.baseURL = config.baseURL
    this.defaultHeaders = config.headers || {}
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    if (!params) return fullURL

    const urlObj = new URL(fullURL)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlObj.searchParams.append(key, String(value))
      }
    })

    return urlObj.toString()
  }

  private handleNetworkError(error: RequestError<{ message: string }>) {
    if (error && error.response && error.response.data) {
      const { message } = error.response.data
      switch (error.response.status) {
        case 503:
          this.updateNetworkError(message || undefined)
          break
        case 422:
        case 404:
        case 400:
          break
        case 429:
          this.updateNetworkError('toast.too_many_request')
          break
        default:
          this.updateNetworkError()
          break
      }
    } else {
      this.updateNetworkError()
    }
  }

  private updateNetworkError(errMessage = 'toast.invalid_network') {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      networkErrMsgs$.next([])
      this.timeout = null
    }, 2000)
    networkErrMsgs$.next([errMessage])
  }

  private timeout: ReturnType<typeof setTimeout> | null = null

  private async request<T = any>(config: RequesterRequestConfig): Promise<RequesterResponse<T>> {
    try {
      const { method = 'GET', url = '', data, params, headers = {} } = config

      let requestData = data
      if (method.toLowerCase() === 'get') {
        requestData = {
          unused: 0,
        }
      }

      const requestConfig: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
      }

      if (requestData && method.toUpperCase() !== 'GET') {
        if (typeof requestData === 'object') {
          requestConfig.body = JSON.stringify(requestData)
        } else {
          requestConfig.body = requestData
        }
      }

      const response = await fetch(this.buildURL(url, params), requestConfig)

      let responseData: T
      const contentType = response.headers.get('content-type')
      if (
        contentType &&
        (contentType.includes('application/json') || contentType.includes('application/vnd.api+json'))
      ) {
        responseData = await response.json()
      } else {
        responseData = (await response.text()) as T
      }

      const requesterResponse: RequesterResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config,
      }

      if (!response.ok) {
        const error: RequestError = new Error(`Request failed with status ${response.status}`) as RequestError
        error.response = requesterResponse
        error.config = config
        throw error
      }

      return requesterResponse
    } catch (error) {
      const requestError = error as RequestError
      requestError.isRequestError = true
      if (!requestError.response) {
        requestError.config = config
      }

      this.handleNetworkError(requestError)
      throw requestError
    }
  }

  async get<T = any>(
    url: string,
    config?: Omit<RequesterRequestConfig, 'url' | 'method'>,
  ): Promise<RequesterResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequesterRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<RequesterResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data })
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequesterRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<RequesterResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data })
  }

  async delete<T = any>(
    url: string,
    config?: Omit<RequesterRequestConfig, 'url' | 'method'>,
  ): Promise<RequesterResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }

  async call<T = any>(url: string, config?: RequesterRequestConfig): Promise<RequesterResponse<T>> {
    return this.request<T>({ ...config, url })
  }
}

const createFetchClient = (config: { baseURL: string; headers?: Record<string, string>; data?: any }) => {
  return new FetchClient(config)
}

export const requesterV1 = createFetchClient({
  baseURL: `${CONFIG.API_URL}/api/v1/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

export const requesterV2 = createFetchClient({
  baseURL: `${CONFIG.API_URL}/api/v2/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})
