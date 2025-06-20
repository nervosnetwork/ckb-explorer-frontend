import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Routers from './routes'
import Toast from './components/Toast'
import { isMainnet } from './utils/chain'
import { DASQueryContextProvider } from './hooks/useDASAccount'
import { CKBNodeProvider } from './hooks/useCKBNode'
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
      staleTime: 60 * 1000,
      initialDataUpdatedAt: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
})

const App = () => {
  return (
    <>
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
      <Decoder />
    </>
  )
}

export default App
