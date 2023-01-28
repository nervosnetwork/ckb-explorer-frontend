import { AppDispatch } from '../../../contexts/reducer'
import { fetchStatisticTotalSupply } from '../../http/fetcher'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchTotalSupply } from './action'

export const getStatisticTotalSupply = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.TotalSupply)
  if (data) {
    dispatchTotalSupply(dispatch, data)
    return
  }
  fetchStatisticTotalSupply()
    .then((response: Response.Wrapper<State.StatisticTotalSupply>[] | null) => {
      if (!response) return
      const statisticTotalSupplies = response.map(wrapper => ({
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        circulatingSupply: wrapper.attributes.circulatingSupply,
        burnt: wrapper.attributes.burnt,
        lockedCapacity: wrapper.attributes.lockedCapacity,
      }))
      dispatchTotalSupply(dispatch, statisticTotalSupplies)
      if (statisticTotalSupplies && statisticTotalSupplies.length > 0) {
        storeDateChartCache(ChartCachedKeys.TotalSupply, statisticTotalSupplies)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticTotalSupplyFetchEnd,
        payload: {
          statisticTotalSuppliesFetchEnd: true,
        },
      })
    })
}
