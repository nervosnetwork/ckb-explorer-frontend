import { fetchStatisticEpochTimeDistribution } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchEpochTimeDistribution } from './action'

export const getStatisticEpochTimeDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.EpochTimeDistribution)
  if (data) {
    dispatchEpochTimeDistribution(dispatch, data)
    return
  }
  fetchStatisticEpochTimeDistribution()
    .then((wrap: Response.Wrapper<State.StatisticEpochTimeDistributions> | null) => {
      if (!wrap) return
      const {
        attributes: { epochTimeDistribution },
      } = wrap
      const statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[] = epochTimeDistribution.map(
        data => {
          const [time, epoch] = data
          return {
            time,
            epoch,
          }
        },
      )
      dispatchEpochTimeDistribution(dispatch, statisticEpochTimeDistributions)
      if (statisticEpochTimeDistributions && statisticEpochTimeDistributions.length > 0) {
        storeDateChartCache(ChartCachedKeys.EpochTimeDistribution, statisticEpochTimeDistributions)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticEpochTimeDistributionFetchEnd,
        payload: {
          statisticEpochTimeDistributionsFetchEnd: true,
        },
      })
    })
}
