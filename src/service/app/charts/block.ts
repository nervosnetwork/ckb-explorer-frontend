import { fetchStatisticBlockTimeDistribution, fetchStatisticEpochTimeDistribution } from '../../http/fetcher'
import { AppDispatch, PageActions } from '../../../contexts/providers/reducer'

export const getStatisticBlockTimeDistribution = (dispatch: AppDispatch) => {
  fetchStatisticBlockTimeDistribution().then((wrap: Response.Wrapper<State.StatisticBlockTimeDistributions> | null) => {
    if (!wrap) return
    const {
      attributes: { blockTimeDistribution },
    } = wrap
    const statisticBlockTimeDistributions: State.StatisticBlockTimeDistribution[] = blockTimeDistribution.map(data => {
      const [time, blocks] = data
      return {
        time,
        blocks,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticBlockTimeDistribution,
      payload: {
        statisticBlockTimeDistributions,
      },
    })
  })
}

export const getStatisticEpochTimeDistribution = (dispatch: AppDispatch) => {
  fetchStatisticEpochTimeDistribution().then((wrap: Response.Wrapper<State.StatisticEpochTimeDistributions> | null) => {
    if (!wrap) return
    const {
      attributes: { epochTimeDistribution },
    } = wrap
    const statisticEpochTimeDistributions: State.StatisticEpochTimeDistribution[] = epochTimeDistribution.map(data => {
      const [time, epoch] = data
      return {
        time,
        epoch,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticEpochTimeDistribution,
      payload: {
        statisticEpochTimeDistributions,
      },
    })
  })
}
