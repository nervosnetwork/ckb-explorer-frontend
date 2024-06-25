import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import { isMainnet } from './utils/chain'
import { DASQueryContextProvider } from './hooks/useDASAccount'
import { CKBNodeProvider } from './hooks/useCKBNode'
import { getPrimaryColor, getSecondaryColor } from './constants/common'
import Decoder from './components/Decoder'
import config from './config'

const { BACKUP_NODES: backupNodes } = config

const appStyle = {
  width: '100vw',
  height: '100vh',
  maxWidth: '100%',
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
})

const App = () => {
  const theme = useMemo<DefaultTheme>(
    () => ({
      primary: getPrimaryColor(),
      secondary: getSecondaryColor(),
    }),
    [],
  )

  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={appStyle} data-net={isMainnet() ? 'mainnet' : 'testnet'}>
          <QueryClientProvider client={queryClient}>
            <CKBNodeProvider defaultEndpoint={backupNodes[0]}>
              <DASQueryContextProvider>
                <Routers />
                <Toast />
              </DASQueryContextProvider>
            </CKBNodeProvider>
          </QueryClientProvider>
        </div>
      </ThemeProvider>
      <Decoder />
    </>
  )
}

export default App
