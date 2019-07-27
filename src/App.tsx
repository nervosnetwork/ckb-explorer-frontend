import React from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './providers'
import { useInitApp, useWindowResize } from './contexts/hook'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const App = () => {
  useInitApp()
  useWindowResize()

  return (
    <AppDiv>
      <Routers />
      <Toast />
    </AppDiv>
  )
}

export default withProviders(App)
