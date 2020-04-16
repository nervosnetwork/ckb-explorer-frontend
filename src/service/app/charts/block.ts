import { fetchStatisticBlockTimeDistribution } from '../../http/fetcher'
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

export default { getStatisticBlockTimeDistribution }
