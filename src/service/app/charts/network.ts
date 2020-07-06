import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchStatisticNewNodeCount, fetchStatisticNodeDistribution } from '../../http/fetcher'
import { fetchDateChartCache } from '../../../utils/cache'
import { CachedKeys } from '../../../utils/const'
import { dispatchNodeDistribution } from './action'

export const getStatisticNewNodeCount = (dispatch: AppDispatch) => {
  fetchStatisticNewNodeCount().then((response: Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]> | null) => {
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
  })
}

export const getStatisticNodeDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.NodeDistribution)
  if (data) {
    dispatchNodeDistribution(dispatch, data)
    return
  }
  fetchStatisticNodeDistribution()
    .then((wrapper: Response.Wrapper<State.StatisticNodeDistributions> | null) => {
      if (!wrapper) return
      const { nodesDistribution } = wrapper.attributes
      let statisticNodeDistributions: State.StatisticNodeDistribution[] = []
      nodesDistribution.forEach(data => {
        statisticNodeDistributions.push({
          name: data.city,
          value: [Number(data.longitude), Number(data.latitude), data.count],
        })
      })
      dispatchNodeDistribution(dispatch, statisticNodeDistributions)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticNodeDistributionFetchEnd,
        payload: {
          statisticNodeDistributionsFetchEnd: true,
        },
      })
    })
}
