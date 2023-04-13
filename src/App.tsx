import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders, { useAppState } from './contexts/providers'
import useInitApp from './contexts/providers/hook'
import { isMainnet } from './utils/chain'
import { DASQueryContextProvider } from './contexts/providers/dasQuery'
import { getPrimaryColor } from './constants/common'

const appStyle = {
  width: '100vw',
  height: '100vh',
  maxWidth: '100%',
}

const queryClient = new QueryClient()

const App = withProviders(() => {
  useInitApp()
  const { app } = useAppState()
  const theme = useMemo(
    () => ({
      primary: app.primaryColor,
      secondary: app.secondaryColor,
    }),
    [app.primaryColor, app.secondaryColor],
  )

  const antdTheme = {
    token: {
      colorPrimary: getPrimaryColor(),
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider theme={antdTheme}>
        <div style={appStyle} data-net={isMainnet() ? 'mainnet' : 'testnet'}>
          <QueryClientProvider client={queryClient}>
            <DASQueryContextProvider>
              <Routers />
              <Toast />
            </DASQueryContextProvider>
          </QueryClientProvider>
        </div>
      </ConfigProvider>
    </ThemeProvider>
  )
})

export default App
