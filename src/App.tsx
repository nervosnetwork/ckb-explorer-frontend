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
// code: 1018 => "No records found by given query key"
const ConfigErrorCodes = [1004, 1018]

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
        const codes: number[] = []
        if (error.response.data instanceof Array) {
          codes.concat(
            error.response.data.map((data: any) => {
              return data.code
            }),
          )
        }
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
            setShowError(true)
            ConfigErrorCodes.forEach(errorCode => {
              codes.forEach(code => {
                if (errorCode === code) {
                  setShowError(false)
                }
              })
            })
            break
          default:
            setShowError(true)
            break
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
        style={{
          bottom: 10,
        }}
      />
    </AppDiv>
  )
}

export default withProviders(App)
