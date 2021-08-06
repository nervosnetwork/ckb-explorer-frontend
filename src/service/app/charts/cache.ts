import { fetchFlushChartCache } from '../../http/fetcher'
import { removeCachedData, fetchCachedData } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'

export const flushCacheInfo = () => {
  fetchFlushChartCache().then((wrapper: Response.Wrapper<State.StatisticCacheInfo> | null) => {
    if (wrapper && wrapper.attributes.flushCacheInfo.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [, value] of Object.entries(ChartCachedKeys)) {
        removeCachedData(fetchCachedData(value) as string)
        removeCachedData(value)
      }
    }
  })
}

export default flushCacheInfo
