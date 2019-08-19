import React from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './contexts/providers'
import { useInitApp } from './contexts/providers/hook'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const App = withProviders(({ dispatch }: any) => {
  useInitApp(dispatch)

  return (
    <AppDiv>
      <Routers dispatch={dispatch} />
      <Toast />
    </AppDiv>
  )
})

export default App
