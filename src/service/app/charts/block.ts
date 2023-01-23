import { fetchStatisticBlockTimeDistribution, fetchStatisticEpochTimeDistribution } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchBlockTimeDistribution, dispatchEpochTimeDistribution } from './action'

export const getStatisticBlockTimeDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.BlockTimeDistribution)
  if (data) {
    dispatchBlockTimeDistribution(dispatch, data)
    return
  }
  fetchStatisticBlockTimeDistribution()
    .then((wrap: Response.Wrapper<State.StatisticBlockTimeDistributions> | null) => {
      if (!wrap) return
      const {
        attributes: { blockTimeDistribution },
      } = wrap
      const sumBlocks = blockTimeDistribution
        .flatMap(data => Number(data[1]))
        .reduce((previous, current) => previous + current)
      const statisticBlockTimeDistributions = [
        {
          time: '0',
          ratio: '0',
        },
      ].concat(
        blockTimeDistribution.map(data => {
          const [time, blocks] = data
          return {
            time,
            ratio: (Number(blocks) / sumBlocks).toFixed(5),
          }
        }),
      )
      dispatchBlockTimeDistribution(dispatch, statisticBlockTimeDistributions)
      if (statisticBlockTimeDistributions && statisticBlockTimeDistributions.length > 0) {
        storeDateChartCache(ChartCachedKeys.BlockTimeDistribution, statisticBlockTimeDistributions)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticBlockTimeDistributionFetchEnd,
        payload: {
          statisticBlockTimeDistributionsFetchEnd: true,
        },
      })
    })
}

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
