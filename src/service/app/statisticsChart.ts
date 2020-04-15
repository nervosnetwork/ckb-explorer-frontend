import BigNumber from 'bignumber.js'
import {
  fetchStatisticDifficultyHashRate,
  fetchStatisticDifficultyUncleRate,
  fetchStatisticTransactionCount,
  fetchStatisticAddressCount,
  fetchStatisticTotalDaoDeposit,
  fetchStatisticCellCount,
  fetchStatisticAddressBalanceRank,
  fetchStatisticDifficulty,
  fetchStatisticHashRate,
  fetchStatisticUncleRate,
  fetchStatisticBalanceDistribution,
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
      dispatch({
        type: PageActions.UpdateStatisticDifficultyUncleRate,
        payload: {
          statisticDifficultyUncleRates: difficultyUncleRates,
        },
      })
    },
  )
}

export const getStatisticDifficulty = (dispatch: AppDispatch) => {
  fetchStatisticDifficulty().then(
    (response: Response.Response<Response.Wrapper<State.StatisticDifficulty>[]> | null) => {
      if (!response) return
      const { data } = response
      const difficulties = data.map(wrapper => {
        return {
          avgDifficulty: wrapper.attributes.avgDifficulty,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticDifficulty,
        payload: {
          statisticDifficulties: difficulties,
        },
      })
    },
  )
}

export const getStatisticHashRate = (dispatch: AppDispatch) => {
  fetchStatisticHashRate().then((response: Response.Response<Response.Wrapper<State.StatisticHashRate>[]> | null) => {
    if (!response) return
    const { data } = response
    const hashRates = data.map(wrapper => {
      return {
        avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toNumber(),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticHashRate,
      payload: {
        statisticHashRates: hashRates,
      },
    })
  })
}

export const getStatisticUncleRate = (dispatch: AppDispatch) => {
  fetchStatisticUncleRate().then((response: Response.Response<Response.Wrapper<State.StatisticUncleRate>[]> | null) => {
    if (!response) return
    const { data } = response
    const uncleRates = data.map(wrapper => {
      return {
        uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }
    })
    dispatch({
      type: PageActions.UpdateStatisticUncleRate,
      payload: {
        statisticUncleRates: uncleRates,
      },
    })
  })
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
          totalDepositorsCount: wrapper.attributes.totalDepositorsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
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
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }
    })
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
    dispatch({
      type: PageActions.UpdateStatisticAddressBalanceRank,
      payload: {
        statisticAddressBalanceRanks: addressBalanceRanks,
      },
    })
  })
}

export const getStatisticBalanceDistribution = (dispatch: AppDispatch) => {
  fetchStatisticBalanceDistribution().then(
    (wrapper: Response.Wrapper<State.StatisticAddressBalanceDistribution> | null) => {
      if (!wrapper) return
      const balanceDistributionArray = wrapper.attributes.addressBalanceDistribution
      const balanceDistributions = balanceDistributionArray.map(distribution => {
        const [balance, addresses, sumAddresses] = distribution
        return {
          balance,
          addresses,
          sumAddresses,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticBalanceDistribution,
        payload: {
          statisticBalanceDistributions: balanceDistributions,
        },
      })
    },
  )
}
