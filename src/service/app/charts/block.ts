import {
  fetchStatisticBlockTimeDistribution,
  fetchStatisticEpochTimeDistribution,
  fetchStatisticAverageBlockTimes,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

export const getStatisticBlockTimeDistribution = (dispatch: AppDispatch) => {
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
      dispatch({
        type: PageActions.UpdateStatisticBlockTimeDistribution,
        payload: {
          statisticBlockTimeDistributions,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticBlockTimeDistributionFetchEnd,
        payload: {
          statisticBlockTimeDistributionsFetchEnd: true,
        },
      })
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
  fetchStatisticAverageBlockTimes()
    .then((wrap: Response.Wrapper<State.StatisticAverageBlockTimes> | null) => {
      if (!wrap) return
      const {
        attributes: { averageBlockTime },
      } = wrap
      dispatch({
        type: PageActions.UpdateStatisticAverageBlockTime,
        payload: {
          statisticAverageBlockTimes: averageBlockTime,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticAverageBlockTimeFetchEnd,
        payload: {
          statisticAverageBlockTimesFetchEnd: true,
        },
      })
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
      dispatch({
        type: PageActions.UpdateStatisticEpochTimeDistribution,
        payload: {
          statisticEpochTimeDistributions,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticEpochTimeDistributionFetchEnd,
        payload: {
          statisticEpochTimeDistributionsFetchEnd: true,
        },
      })
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
