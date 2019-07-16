import React, { useContext } from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './providers'
import AppContext from './contexts/App'
import { handleBlockchainAlert } from './service/app/blockchain'
import { useInterval, useWindowResize, useAxiosInterceptors } from './hooks/hook'
import { RESIZE_LATENCY, BLOCKCHAIN_ALERT_POLLING_TIME } from './utils/const'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
let resizeTimer: any = null

const App = () => {
  const appContext: any = useContext(AppContext)
  useAxiosInterceptors(appContext)

  useWindowResize(() => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      appContext.resize(window.innerWidth, window.innerHeight)
      resizeTimer = null
    }, RESIZE_LATENCY)
  })

  useInterval(() => {
    handleBlockchainAlert(appContext)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)

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
