import React, { useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders, { AppContext } from './contexts/providers'
import useInitApp from './contexts/providers/hook'
import { MAINNET_THEME_COLOR, TESTNET_THEME_COLOR } from './utils/const'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const App = withProviders(({ dispatch }: any) => {
  const { app } = useContext(AppContext)
  const theme = {
    main: app.isMainnet ? MAINNET_THEME_COLOR : TESTNET_THEME_COLOR,
  }

  useInitApp(dispatch)

  return (
    <ThemeProvider theme={theme}>
      <AppDiv>
        <Routers dispatch={dispatch} />
        <Toast />
      </AppDiv>
    </ThemeProvider>
  )
})

export default App
