import React, { useContext, useState } from 'react'
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

// code: 1004 => "Block Not Found"
const ConfigErrorCodes = [1004]

const App = () => {
  const appContext = useContext(AppContext)
  const [showError, setShowError] = useState(false)

  // global fetch interceptor setting
  axiosIns.interceptors.request.use(
    config => {
      return config
    },
    error => {
      console.error(error.toString())
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
            browserHistory.replace('/search/fail')
            break
          case 503:
            setShowError(false)
            if (message) {
              appContext.errorMessage = message
            }
            browserHistory.replace('/maintain')
            break
          case 404:
            setShowError(true)
            ConfigErrorCodes.forEach(code => {
              if (code === 1004) {
                setShowError(false)
              }
            })
            break
          default:
            setShowError(true)
        }
      }
      return Promise.reject(error)
    },
  )

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
        toastMessage={appContext.toast}
        style={{
          bottom: 10,
        }}
      />
    </AppDiv>
  )
}

export default withProviders(App)
