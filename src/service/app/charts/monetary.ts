import { AppDispatch } from '../../../contexts/reducer'
import {
  fetchStatisticTotalSupply,
  fetchStatisticAnnualPercentageCompensation,
  fetchStatisticSecondaryIssuance,
} from '../../http/fetcher'
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

export const getStatisticSecondaryIssuance = (dispatch: AppDispatch) => {
  fetchStatisticSecondaryIssuance().then((wrappers: Response.Wrapper<State.StatisticSecondaryIssuance>[] | null) => {
    if (!wrappers) return
    const statisticSecondaryIssuance = wrappers.map(wrapper => {
      const { depositCompensation, miningReward, treasuryAmount, createdAtUnixtimestamp } = wrapper.attributes
      const sum = Number(treasuryAmount) + Number(miningReward) + Number(depositCompensation)
      const treasuryAmountPercent = Number(((Number(treasuryAmount) / sum) * 100).toFixed(2))
      const miningRewardPercent = Number(((Number(miningReward) / sum) * 100).toFixed(2))
      const depositCompensationPercent = (100 - treasuryAmountPercent - miningRewardPercent).toFixed(2)
      return {
        createdAtUnixtimestamp,
        treasuryAmount: treasuryAmountPercent,
        miningReward: miningRewardPercent,
        depositCompensation: depositCompensationPercent,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticSecondaryIssuance,
      payload: {
        statisticSecondaryIssuance,
      },
    })
  })
}
