import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Loading from './components/Loading'
import Modal from './components/Modal'
import Toast from './components/Toast'

import withProviders from './providers'
import AppContext from './contexts/App'
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

const alertNotEmpty = (response: BlockchainInfoWrapper) => {
  return (
    response &&
    response.attributes &&
    response.attributes.blockchain_info &&
    response.attributes.blockchain_info.alerts &&
    response.attributes.blockchain_info.alerts.length > 0
  )
}

const App = () => {
  const appContext = useContext(AppContext)
  const [errors, setErrors] = useState([] as string[])
  const [alerts, setAlerts] = useState([] as string[])

  const resizeListener = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      appContext.resize(window.innerWidth, window.innerHeight)
      resizeTimer = null
    }, RESIZE_LATENCY)
  }

  useEffect(() => {
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
        setErrors([])
        return response
      },
      error => {
        setErrors([NetworkError])
        if (error && error.response && error.response.data) {
          const { message } = error.response.data
          switch (error.response.status) {
            case 422:
              setErrors([])
              break
            case 503:
              setErrors([])
              if (message) {
                appContext.errorMessage = message
              }
              browserHistory.replace('/maintain')
              break
            case 404:
              setErrors([])
              break
            default:
              setErrors([NetworkError])
              break
          }
        }
        return Promise.reject(error)
      },
    )
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
          setAlerts(response.attributes.blockchain_info.alerts)
        } else {
          setAlerts([])
        }
      })
    }, BLOCKCHAIN_ALERT_POLLING_TIME)
    return () => clearInterval(listen)
  }, [])

  return (
    <AppDiv>
      <Routers contexts={alerts.concat(errors)} />
      <Modal
        onClose={() => {
          appContext.hideModal()
        }}
        data={appContext.modal}
      />
      <Loading
        onClose={() => {
          appContext.hideLoading()
        }}
        show={appContext.show}
      />
      <Toast
        style={{
          bottom: 10,
        }}
      />
    </AppDiv>
  )
}

export default withProviders(App)
