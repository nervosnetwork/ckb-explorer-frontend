import { AppDispatch, PageActions } from '../../../contexts/providers/reducer'
import { fetchStatisticNewNodeCount } from '../../http/fetcher'

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
