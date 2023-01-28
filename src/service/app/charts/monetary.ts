import BigNumber from 'bignumber.js'
import { AppDispatch } from '../../../contexts/reducer'
import { fetchStatisticTotalSupply, fetchStatisticSecondaryIssuance, fetchStatisticLiquidity } from '../../http/fetcher'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchTotalSupply, dispatchSecondaryIssuance, dispatchLiquidity } from './action'

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

export const getStatisticSecondaryIssuance = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.SecondaryIssuance)
  if (data) {
    dispatchSecondaryIssuance(dispatch, data)
    return
  }
  fetchStatisticSecondaryIssuance()
    .then((wrappers: Response.Wrapper<State.StatisticSecondaryIssuance>[] | null) => {
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
      dispatchSecondaryIssuance(dispatch, statisticSecondaryIssuance)
      if (statisticSecondaryIssuance && statisticSecondaryIssuance.length > 0) {
        storeDateChartCache(ChartCachedKeys.SecondaryIssuance, statisticSecondaryIssuance)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticSecondaryIssuanceFetchEnd,
        payload: {
          statisticSecondaryIssuanceFetchEnd: true,
        },
      })
    })
}

export const getStatisticLiquidity = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.Liquidity)
  if (data) {
    dispatchLiquidity(dispatch, data)
    return
  }
  fetchStatisticLiquidity()
    .then((wrapper: Response.Wrapper<State.StatisticLiquidity>[] | null) => {
      if (!wrapper) return
      const statisticLiquidity: State.StatisticLiquidity[] = wrapper.map(data => ({
        createdAtUnixtimestamp: data.attributes.createdAtUnixtimestamp,
        circulatingSupply: data.attributes.circulatingSupply,
        liquidity: data.attributes.liquidity,
        daoDeposit: new BigNumber(data.attributes.circulatingSupply)
          .minus(new BigNumber(data.attributes.liquidity))
          .toFixed(2),
      }))
      dispatchLiquidity(dispatch, statisticLiquidity)
      if (statisticLiquidity && statisticLiquidity.length > 0) {
        storeDateChartCache(ChartCachedKeys.Liquidity, statisticLiquidity)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticLiquidityFetchEnd,
        payload: {
          statisticLiquidityFetchEnd: true,
        },
      })
    })
}
