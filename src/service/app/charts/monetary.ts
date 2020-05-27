import { AppDispatch } from '../../../contexts/reducer'
import { fetchStatisticTotalSupply, fetchStatisticAnnualPercentageCompensation } from '../../http/fetcher'
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

export const getStatisticAnnualPercentageCompensation = (dispatch: AppDispatch) => {
  fetchStatisticAnnualPercentageCompensation().then(
    (wrapper: Response.Wrapper<State.StatisticAnnualPercentageCompensations> | null) => {
      if (!wrapper) return
      const statisticAnnualPercentageCompensations = wrapper.attributes.nominalApc
        .filter((_apc, index) => index % 3 === 1 || index === wrapper.attributes.nominalApc.length - 1)
        .map((apc, index) => {
          return {
            year: 0.25 * index,
            apc,
          }
        })
      dispatch({
        type: PageActions.UpdateStatisticAnnualPercentageCompensation,
        payload: {
          statisticAnnualPercentageCompensations,
        },
      })
    },
  )
}
