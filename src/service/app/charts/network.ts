import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchStatisticNewNodeCount, fetchStatisticNodeDistribution } from '../../http/fetcher'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchNodeDistribution } from './action'

export const getStatisticNewNodeCount = (dispatch: AppDispatch) => {
  fetchStatisticNewNodeCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewNodeCounts = data.map(wrapper => ({
        nodesCount: wrapper.attributes.nodesCount ? wrapper.attributes.nodesCount : '0',
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
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
  const data = fetchDateChartCache(ChartCachedKeys.NodeDistribution)
  if (data) {
    dispatchNodeDistribution(dispatch, data)
    return
  }
  fetchStatisticNodeDistribution()
    .then((wrapper: Response.Wrapper<State.StatisticNodeDistributions> | null) => {
      if (!wrapper) return
      const { nodesDistribution } = wrapper.attributes
      const statisticNodeDistributions: State.StatisticNodeDistribution[] = []
      nodesDistribution.forEach(data => {
        statisticNodeDistributions.push({
          name: data.city,
          value: [Number(data.longitude), Number(data.latitude), data.count],
        })
      })
      dispatchNodeDistribution(dispatch, statisticNodeDistributions)
      if (statisticNodeDistributions && statisticNodeDistributions.length > 0) {
        storeDateChartCache(ChartCachedKeys.NodeDistribution, statisticNodeDistributions)
      }
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
