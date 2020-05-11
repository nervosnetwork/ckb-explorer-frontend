import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchStatisticNewNodeCount, fetchStatisticNodeDistribution } from '../../http/fetcher'

export const getStatisticNewNodeCount = (dispatch: AppDispatch) => {
  fetchStatisticNewNodeCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewNodeCounts = data.map(wrapper => {
        return {
          nodesCount: wrapper.attributes.nodesCount ? wrapper.attributes.nodesCount : '0',
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticNewNodeCount,
        payload: {
          statisticNewNodeCounts,
        },
      })
    },
  )
}

export const getStatisticNodeDistribution = (dispatch: AppDispatch) => {
  fetchStatisticNodeDistribution().then((wrapper: Response.Wrapper<State.StatisticNodeDistributions> | null) => {
    if (!wrapper) return
    const { nodesDistribution } = wrapper.attributes
    let statisticNodeDistributions: State.StatisticNodeDistribution[] = []
    nodesDistribution.forEach(data => {
      statisticNodeDistributions.push({
        name: data.city,
        value: [Number(data.longitude), Number(data.latitude), data.count],
      })
    })
    dispatch({
      type: PageActions.UpdateStatisticNodeDistribution,
      payload: {
        statisticNodeDistributions,
      },
    })
  })
}
