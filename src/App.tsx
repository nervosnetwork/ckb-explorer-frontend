import { useMemo } from 'react'
import { ThemeProvider } from 'styled-components'
import 'antd/dist/antd.css'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders, { useAppState } from './contexts/providers'
import useInitApp, { useInitHardForkStatus } from './contexts/providers/hook'
import { isMainnet } from './utils/chain'

const appStyle = {
  width: '100vw',
  height: '100vh',
  maxWidth: '100%',
}

const App = withProviders(() => {
  useInitApp()
  const initHardForkStatus = useInitHardForkStatus()
  const { app } = useAppState()
  const theme = useMemo(
    () => ({
      primary: app.primaryColor,
      secondary: app.secondaryColor,
    }),
    [app.primaryColor, app.secondaryColor],
  )

  return (
    <ThemeProvider theme={theme}>
      <div style={appStyle} data-net={isMainnet() ? 'mainnet' : 'testnet'}>
        {initHardForkStatus && (
          <>
            <Routers />
            <Toast />
          </>
        )}
      </div>
    </ThemeProvider>
  )
})

export default App
