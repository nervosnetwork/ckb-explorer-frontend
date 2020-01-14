import BigNumber from 'bignumber.js'
import {
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRate,
  fetchStatisticTransactionCount,
  fetchStatisticAddressCount,
  fetchStatisticTotalDaoDeposit,
  fetchStatisticCellCount,
  fetchStatisticAddressBalanceRank,
} from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'

export const getStatisticDifficultyHashRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyHashRate().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficultyHashRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyHashRates = data.map(wrapper => {
        return {
          epochNumber: wrapper.attributes.epochNumber,
          difficulty: wrapper.attributes.difficulty,
          hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toNumber(),
        }
      })
      if (difficultyHashRates.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticDifficultyHashRate,
        payload: {
          statisticDifficultyHashRates: difficultyHashRates,
        },
      })
    },
  )
}

export const getStatisticDifficultyUncleRate = (dispatch: AppDispatch) => {
  fetchStatisticDifficultyUncleRate().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficultyUncleRate>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficultyUncleRates = data.map(wrapper => {
        return {
          epochNumber: wrapper.attributes.epochNumber,
          difficulty: wrapper.attributes.difficulty,
          uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        }
      })
      if (difficultyUncleRates.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRate,
        payload: {
          statisticDifficultyUncleRates: difficultyUncleRates,
        },
      })
    },
  )
}

export const getStatisticTransactionCount = (dispatch: AppDispatch) => {
  fetchStatisticTransactionCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const transactionCounts = data.map(wrapper => {
        return {
          transactionsCount: wrapper.attributes.transactionsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      if (transactionCounts.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticTransactionCount,
        payload: {
          statisticTransactionCounts: transactionCounts,
        },
      })
    },
  )
}

export const getStatisticAddressCount = (dispatch: AppDispatch) => {
  fetchStatisticAddressCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticAddressCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const addressCounts = data.map(wrapper => {
        return {
          addressesCount: wrapper.attributes.addressesCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      if (addressCounts.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticAddressCount,
        payload: {
          statisticAddressCounts: addressCounts,
        },
      })
    },
  )
}

export const getStatisticTotalDaoDeposit = (dispatch: AppDispatch) => {
  fetchStatisticTotalDaoDeposit().then(
    (response: Response.Response<Response.Wrapper<State.StatisticTotalDaoDeposit>[]> | null) => {
      if (!response) return
      const { data } = response
      const totalDaoDeposits = data.map(wrapper => {
        return {
          totalDaoDeposit: wrapper.attributes.totalDaoDeposit,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      if (totalDaoDeposits.length === 0) return
      dispatch({
        type: PageActions.UpdateStatisticTotalDaoDeposit,
        payload: {
          statisticTotalDaoDeposits: totalDaoDeposits,
        },
      })
    },
  )
}

export const getStatisticCellCount = (dispatch: AppDispatch) => {
  fetchStatisticCellCount().then((response: Response.Response<Response.Wrapper<State.StatisticCellCount>[]> | null) => {
    if (!response) return
    const { data } = response
    const cellCounts = data.map(wrapper => {
      return {
        liveCellsCount: wrapper.attributes.liveCellsCount,
        deadCellsCount: wrapper.attributes.deadCellsCount,
        allCellsCount: (
          Number(wrapper.attributes.liveCellsCount) + Number(wrapper.attributes.deadCellsCount)
        ).toString(),
        blockNumber: wrapper.attributes.blockNumber,
      }
    })
    if (cellCounts.length === 0) return
    dispatch({
      type: PageActions.UpdateStatisticCellCount,
      payload: {
        statisticCellCounts: cellCounts,
      },
    })
  })
}

export const getStatisticAddressBalanceRank = (dispatch: AppDispatch) => {
  fetchStatisticAddressBalanceRank().then((wrapper: Response.Wrapper<State.StatisticAddressBalanceRanking> | null) => {
    if (!wrapper) return
    const addressBalanceRanks = wrapper.attributes.addressBalanceRanking
    if (addressBalanceRanks.length === 0) return
    dispatch({
      type: PageActions.UpdateStatisticAddressBalanceRank,
      payload: {
        statisticAddressBalanceRanks: addressBalanceRanks,
      },
    })
  })
}
