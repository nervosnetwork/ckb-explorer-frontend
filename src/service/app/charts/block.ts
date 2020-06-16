import {
  fetchStatisticBlockTimeDistribution,
  fetchStatisticEpochTimeDistribution,
  fetchStatisticAverageBlockTimes,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { CachedKeys } from '../../../utils/const'
import { dispatchAverageBlockTime, dispatchBlockTimeDistribution, dispatchEpochTimeDistribution } from './action'

export const getStatisticBlockTimeDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.BlockTimeDistribution)
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
      const statisticBlockTimeDistributions = [{ time: '0', ratio: '0' }].concat(
        blockTimeDistribution.map(data => {
          const [time, blocks] = data
          return {
            time,
            ratio: (Number(blocks) / sumBlocks).toFixed(5),
          }
        }),
      )
      dispatchBlockTimeDistribution(dispatch, statisticBlockTimeDistributions)
      storeDateChartCache(CachedKeys.BlockTimeDistribution, statisticBlockTimeDistributions)
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

export const getStatisticAverageBlockTimes = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.AverageBlockTime)
  if (data) {
    dispatchAverageBlockTime(dispatch, data)
    return
  }
  fetchStatisticAverageBlockTimes()
    .then((wrap: Response.Wrapper<State.StatisticAverageBlockTimes> | null) => {
      if (!wrap) return
      const {
        attributes: { averageBlockTime },
      } = wrap
      dispatchAverageBlockTime(dispatch, averageBlockTime)
      storeDateChartCache(CachedKeys.AverageBlockTime, averageBlockTime)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticAverageBlockTimeFetchEnd,
        payload: {
          statisticAverageBlockTimesFetchEnd: true,
        },
      })
    })
}

export const getStatisticEpochTimeDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.EpochTimeDistribution)
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
      storeDateChartCache(CachedKeys.EpochTimeDistribution, statisticEpochTimeDistributions)
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
