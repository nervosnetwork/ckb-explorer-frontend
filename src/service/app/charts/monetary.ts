import { AppDispatch } from '../../../contexts/reducer'
import { fetchStatisticTotalSupply } from '../../http/fetcher'
import { PageActions } from '../../../contexts/actions'

export const getStatisticTotalSupply = (dispatch: AppDispatch) => {
  fetchStatisticTotalSupply().then((response: Response.Wrapper<State.StatisticTotalSupply>[] | null) => {
    if (!response) return
    const statisticTotalSupplies = response.map(wrapper => {
      return {
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        circulatingSupply: wrapper.attributes.circulatingSupply,
        burnt: wrapper.attributes.burnt,
        lockedCapacity: wrapper.attributes.lockedCapacity,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticTotalSupply,
      payload: {
        statisticTotalSupplies,
      },
    })
  })
}
