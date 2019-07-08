import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Loading from './components/Loading'
import Modal from './components/Modal'
import Toast from './components/Toast'

import withProviders from './providers'
import AppContext from './contexts/App'
import { axiosIns } from './http/fetcher'
import browserHistory from './routes/history'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const resizeLatency = 500
let resizeTimer: any = null

const App = () => {
  const appContext = useContext(AppContext)
  const [showError, setShowError] = useState(false)
  const resizeListener = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      appContext.resize(window.innerWidth, window.innerHeight)
      resizeTimer = null
    }, resizeLatency)
  }
  useEffect(() => {
    // global fetch interceptor setting
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
        setShowError(false)
        return response
      },
      error => {
        setShowError(true)
        if (error && error.response && error.response.data) {
          const { message } = error.response.data
          switch (error.response.status) {
            case 422:
              setShowError(false)
              break
            case 503:
              setShowError(false)
              if (message) {
                appContext.errorMessage = message
              }
              browserHistory.replace('/maintain')
              break
            case 404:
              setShowError(false)
              break
            default:
              setShowError(true)
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
  return (
    <AppDiv>
      <Routers showError={showError} />
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
