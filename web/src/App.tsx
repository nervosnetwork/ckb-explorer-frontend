import React, { useContext, useEffect } from 'react'
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
  let resizeListener: any = null

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
      if (response.status === 503) {
        const { message } = response.data
        appContext.errorMessage = message
        browserHistory.replace('/maintain')
      }
      return response
    },
    error => {
      console.error(error.toString())
      return Promise.reject(error)
    },
  )

  useEffect(() => {
    resizeListener = () => {
      appContext.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
  }, [])
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
