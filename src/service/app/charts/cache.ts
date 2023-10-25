import { explorerService } from '../../../services/ExplorerService'
import { removeCachedData, fetchCachedData } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'

export const flushCacheInfo = async () => {
  const { flushCacheInfo } = await explorerService.api.fetchFlushChartCache()
  if (flushCacheInfo.length === 0) return

  // eslint-disable-next-line no-restricted-syntax
  for (const [, value] of Object.entries(ChartCachedKeys)) {
    removeCachedData(fetchCachedData(value) as string)
    removeCachedData(value)
  }
}

export default flushCacheInfo
