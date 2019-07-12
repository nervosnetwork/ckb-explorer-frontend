import { useEffect, useContext, useState } from 'react'
import { fetchBlockchainInfo, axiosIns } from '../http/fetcher'
import { BLOCKCHAIN_ALERT_POLLING_TIME } from './const'
import { BlockchainInfoWrapper } from '../http/response/BlockchainInfo'
import AppContext from '../contexts/App'

import browserHistory from '../routes/history'
import i18n from './i18n'

const alertNotEmpty = (response: BlockchainInfoWrapper): boolean => {
  return (
    response &&
    response.attributes &&
    response.attributes.blockchain_info &&
    response.attributes.blockchain_info.alerts &&
    response.attributes.blockchain_info.alerts.length > 0
  )
}

export const useBlockchainAlerts = () => {
  const appContext: any = useContext(AppContext)

  useEffect(() => {
    const listen = setInterval(() => {
      fetchBlockchainInfo().then((response: BlockchainInfoWrapper) => {
        if (alertNotEmpty(response)) {
          appContext.updateAppErrors({
            type: 'ChainAlert',
            message: response.attributes.blockchain_info.alerts.map(alert => {
              return alert.message
            }),
          })
        } else {
          appContext.updateAppErrors({
            type: 'ChainAlert',
            message: [],
          })
        }
      })
    }, BLOCKCHAIN_ALERT_POLLING_TIME)
    return () => clearInterval(listen)
  }, [appContext, appContext.updateAppErrors])
}

const RESIZE_LATENCY = 500
let resizeTimer: any = null

export const useWindowResize = () => {
  const appContext: any = useContext(AppContext)
  useEffect(() => {
    const resizeListener = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        appContext.resize(window.innerWidth, window.innerHeight)
        resizeTimer = null
      }, RESIZE_LATENCY)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
    // eslint-disable-next-line
  }, [])
}

const NetworkError = i18n.t('toast.invalid_network')

export const useAxiosInterceptors = () => {
  const appContext: any = useContext(AppContext)
  const [initInterceptors, setInitInterceptors] = useState(false)

  if (!initInterceptors) {
    setInitInterceptors(true)

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
}
