import { AppDispatch } from '../../../contexts/reducer'
import {
  fetchStatisticTotalSupply,
  fetchStatisticAnnualPercentageCompensation,
  fetchStatisticSecondaryIssuance,
  fetchStatisticInflationRate,
  fetchStatisticLiquidity,
} from '../../http/fetcher'
import { PageActions } from '../../../contexts/actions'
import BigNumber from 'bignumber.js'
import { fetchCachedData, storeCachedData } from '../../../utils/cached'
import { CachedKeys } from '../../../utils/const'

export const getStatisticTotalSupply = (dispatch: AppDispatch) => {
  fetchStatisticTotalSupply()
    .then((response: Response.Wrapper<State.StatisticTotalSupply>[] | null) => {
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
      dispatch({
        type: PageActions.UpdateStatisticTotalSupplyFetchEnd,
        payload: {
          statisticTotalSuppliesFetchEnd: true,
        },
      })
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

export const getStatisticAnnualPercentageCompensation = (dispatch: AppDispatch) => {
  const data = fetchCachedData(CachedKeys.APC)
  if (data) {
    dispatch({
      type: PageActions.UpdateStatisticAnnualPercentageCompensation,
      payload: {
        statisticAnnualPercentageCompensations: data,
      },
    })
    dispatch({
      type: PageActions.UpdateStatisticAnnualPercentageCompensationFetchEnd,
      payload: {
        statisticAnnualPercentageCompensationsFetchEnd: true,
      },
    })
    return
  }
  fetchStatisticAnnualPercentageCompensation()
    .then((wrapper: Response.Wrapper<State.StatisticAnnualPercentageCompensations> | null) => {
      if (!wrapper) return
      const statisticAnnualPercentageCompensations = wrapper.attributes.nominalApc
        .filter((_apc, index) => index % 3 === 0 || index === wrapper.attributes.nominalApc.length - 1)
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
      dispatch({
        type: PageActions.UpdateStatisticAnnualPercentageCompensationFetchEnd,
        payload: {
          statisticAnnualPercentageCompensationsFetchEnd: true,
        },
      })
      storeCachedData(CachedKeys.APC, statisticAnnualPercentageCompensations)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticAnnualPercentageCompensationFetchEnd,
        payload: {
          statisticAnnualPercentageCompensationsFetchEnd: true,
        },
      })
    })
}

export const getStatisticSecondaryIssuance = (dispatch: AppDispatch) => {
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
      dispatch({
        type: PageActions.UpdateStatisticSecondaryIssuance,
        payload: {
          statisticSecondaryIssuance,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticSecondaryIssuanceFetchEnd,
        payload: {
          statisticSecondaryIssuanceFetchEnd: true,
        },
      })
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

export const getStatisticInflationRate = (dispatch: AppDispatch) => {
  const data = fetchCachedData(CachedKeys.InflationRate)
  if (data) {
    dispatch({
      type: PageActions.UpdateStatisticInflationRate,
      payload: {
        statisticInflationRates: data,
      },
    })
    dispatch({
      type: PageActions.UpdateStatisticInflationRateFetchEnd,
      payload: {
        statisticInflationRatesFetchEnd: true,
      },
    })
    return
  }
  fetchStatisticInflationRate()
    .then((wrapper: Response.Wrapper<State.StatisticInflationRates> | null) => {
      if (!wrapper) return
      const { nominalApc, nominalInflationRate, realInflationRate } = wrapper.attributes
      let statisticInflationRates = []
      for (let i = 0; i < nominalApc.length; i++) {
        if (i % 6 === 0 || i === nominalApc.length - 1) {
          statisticInflationRates.push({
            year: i % 6 === 0 ? Math.floor(i / 6) * 0.5 : 50,
            nominalApc: nominalApc[i],
            nominalInflationRate: nominalInflationRate[i],
            realInflationRate: realInflationRate[i],
          })
        }
      }
      dispatch({
        type: PageActions.UpdateStatisticInflationRate,
        payload: {
          statisticInflationRates,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticInflationRateFetchEnd,
        payload: {
          statisticInflationRatesFetchEnd: true,
        },
      })
      storeCachedData(CachedKeys.InflationRate, statisticInflationRates)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticInflationRateFetchEnd,
        payload: {
          statisticInflationRatesFetchEnd: true,
        },
      })
    })
}

export const getStatisticLiquidity = (dispatch: AppDispatch) => {
  fetchStatisticLiquidity().then((wrapper: Response.Wrapper<State.StatisticLiquidity>[] | null) => {
    if (!wrapper) return
    const statisticLiquidity: State.StatisticLiquidity[] = wrapper.map(data => {
      return {
        createdAtUnixtimestamp: data.attributes.createdAtUnixtimestamp,
        circulatingSupply: data.attributes.circulatingSupply,
        liquidity: data.attributes.liquidity,
        daoDeposit: new BigNumber(data.attributes.circulatingSupply)
          .minus(new BigNumber(data.attributes.liquidity))
          .toFixed(2),
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticLiquidity,
      payload: {
        statisticLiquidity,
      },
    })
    dispatch({
      type: PageActions.UpdateStatisticLiquidityFetchEnd,
      payload: {
        statisticLiquidityFetchEnd: true,
      },
    })
  })
}
