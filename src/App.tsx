import React, { useContext } from 'react'
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
const App = () => {
  const appContext = useContext(AppContext)

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
      return response
    },
    error => {
      if (error.response.status === 503) {
        const { message } = error.response.data
        appContext.errorMessage = message || appContext.errorMessage
        browserHistory.replace('/maintain')
      }
      console.error(error.toString())
      return Promise.reject(error)
    },
  )

  return (
    <AppDiv>
      <Routers />
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
