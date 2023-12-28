import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import { isMainnet } from './utils/chain'
import { DASQueryContextProvider } from './hooks/useDASAccount'
import { getPrimaryColor, getSecondaryColor } from './constants/common'

const appStyle = {
  width: '100vw',
  height: '100vh',
  maxWidth: '100%',
}

const queryClient = new QueryClient()

const App = () => {
  const theme = useMemo<DefaultTheme>(
    () => ({
      primary: getPrimaryColor(),
      secondary: getSecondaryColor(),
    }),
    [],
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
}

export default App
