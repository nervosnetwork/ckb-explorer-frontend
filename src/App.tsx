import React, { useContext, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './providers'
import AppContext, { AppError } from './contexts/App'
import { axiosIns, fetchBlockchainInfo } from './http/fetcher'
import browserHistory from './routes/history'
import { BLOCKCHAIN_ALERT_POLLING_TIME } from './utils/const'

import { BlockchainInfoWrapper } from './http/response/BlockchainInfo'
import i18n from './utils/i18n'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const RESIZE_LATENCY = 500
let resizeTimer: any = null

const NetworkError = i18n.t('toast.invalid_network')

const alertNotEmpty = (response: BlockchainInfoWrapper): boolean => {
  return (
    response &&
    response.attributes &&
    response.attributes.blockchain_info &&
    response.attributes.blockchain_info.alerts &&
    response.attributes.blockchain_info.alerts.length > 0
  )
}

let initInterceptors = false

const App = () => {
  const appContext: any = useContext(AppContext)
  console.log('app')

  const updateAppErrors = useCallback(
    (appError: AppError) => {
      appContext.dispatch({
        type: 'updateError',
        payload: {
          appError,
        },
      })
    },
    [appContext],
  )

  if (!initInterceptors) {
    initInterceptors = true

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
        updateAppErrors({
          type: 'Network',
          message: [],
        })
        return response
      },
      error => {
        console.log(JSON.stringify(error.response))
        updateAppErrors({
          type: 'Network',
          message: [NetworkError],
        })
        if (error && error.response && error.response.data) {
          const { message }: { message: string } = error.response.data
          switch (error.response.status) {
            case 422:
              updateAppErrors({
                type: 'Network',
                message: [],
              })
              break
            case 503:
              updateAppErrors({
                type: 'Network',
                message: [],
              })
              if (message) {
                updateAppErrors({
                  type: 'Maintain',
                  message: [message],
                })
              }
              browserHistory.replace('/maintain')
              break
            case 404:
              updateAppErrors({
                type: 'Network',
                message: [],
              })
              break
            default:
              updateAppErrors({
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

  useEffect(() => {
    const resizeListener = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        // appContext.resize(window.innerWidth, window.innerHeight)
        resizeTimer = null
      }, RESIZE_LATENCY)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const listen = setInterval(() => {
      fetchBlockchainInfo().then((response: BlockchainInfoWrapper) => {
        if (alertNotEmpty(response)) {
          const alertMessages = response.attributes.blockchain_info.alerts.map(alert => {
            return alert.message
          })
          updateAppErrors({
            type: 'ChainAlert',
            message: alertMessages,
          })
        } else {
          updateAppErrors({
            type: 'ChainAlert',
            message: [],
          })
        }
      })
    }, BLOCKCHAIN_ALERT_POLLING_TIME)
    return () => clearInterval(listen)
  }, [updateAppErrors])

  return (
    <AppDiv>
      <Routers />
      <Toast
        style={{
          bottom: 10,
        }}
      />
    </AppDiv>
  )
}

export default withProviders(App)
