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
  const data = fetchCachedData(CachedKeys.APC)
  if (data) {
    dispatch({
      type: PageActions.UpdateStatisticAnnualPercentageCompensation,
      payload: {
        statisticAnnualPercentageCompensations: data,
      },
    })
    return
  }
  fetchStatisticAnnualPercentageCompensation().then(
    (wrapper: Response.Wrapper<State.StatisticAnnualPercentageCompensations> | null) => {
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
      storeCachedData(CachedKeys.APC, statisticAnnualPercentageCompensations)
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

export const getStatisticInflationRate = (dispatch: AppDispatch) => {
  const data = fetchCachedData(CachedKeys.InflationRate)
  if (data) {
    dispatch({
      type: PageActions.UpdateStatisticInflationRate,
      payload: {
        statisticInflationRates: data,
      },
    })
    return
  }
  fetchStatisticInflationRate().then((wrapper: Response.Wrapper<State.StatisticInflationRates> | null) => {
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
    storeCachedData(CachedKeys.InflationRate, statisticInflationRates)
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
  })
}
