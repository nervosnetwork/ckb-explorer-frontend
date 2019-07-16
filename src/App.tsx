import React from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './providers'
import { useBlockchainAlert, useAxiosInterceptors, useWindowResize } from './contexts/hook'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const App = () => {
  useAxiosInterceptors()
  useWindowResize()
  useBlockchainAlert()

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
