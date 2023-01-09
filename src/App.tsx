import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components'
import 'antd/dist/antd.css'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders, { useAppState } from './contexts/providers'
import useInitApp from './contexts/providers/hook'
import { isMainnet } from './utils/chain'
import { DASQueryContextProvider } from './contexts/providers/dasQuery'

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

  return (
    <ThemeProvider theme={theme}>
      <div style={appStyle} data-net={isMainnet() ? 'mainnet' : 'testnet'}>
        <QueryClientProvider client={queryClient}>
          <DASQueryContextProvider>
            <Routers />
            <Toast />
          </DASQueryContextProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  )
})

export default App
