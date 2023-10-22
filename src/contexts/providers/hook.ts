import { useState } from 'react'
import { FLUSH_CHART_CACHE_POLLING_TIME } from '../../constants/common'
import { useInterval } from '../../utils/hook'
import flushCacheInfo from '../../service/app/charts/cache'

export const useInitApp = () => {
  const [init, setInit] = useState(false)

  if (!init) {
    setInit(true)
    flushCacheInfo()
  }

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export default useInitApp
