import {
  fetchStatisticTransactionCount,
  fetchStatisticAddressCount,
  fetchStatisticCellCount,
  fetchStatisticAddressBalanceRank,
  fetchStatisticBalanceDistribution,
  fetchStatisticTxFeeHistory,
  fetchStatisticOccupiedCapacity,
} from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import {
  dispatchTransactionCount,
  dispatchAddressCount,
  dispatchCellCount,
  dispatchTransactionFee,
  dispatchBalanceRank,
  dispatchBalanceDistribution,
} from './action'

export const getStatisticTransactionCount = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.TransactionCount)
  if (data) {
    dispatchTransactionCount(dispatch, data)
    return
  }
  fetchStatisticTransactionCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const transactionCounts = data.map(wrapper => ({
        transactionsCount: wrapper.attributes.transactionsCount,
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchTransactionCount(dispatch, transactionCounts)
      if (transactionCounts && transactionCounts.length > 0) {
        storeDateChartCache(ChartCachedKeys.TransactionCount, transactionCounts)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticTransactionCountFetchEnd,
        payload: {
          statisticTransactionCountsFetchEnd: true,
        },
      })
    })
}

export const getStatisticAddressCount = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.AddressCount)
  if (data) {
    dispatchAddressCount(dispatch, data)
    return
  }
  fetchStatisticAddressCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticAddressCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const addressCounts = data.map(wrapper => ({
        addressesCount: wrapper.attributes.addressesCount,
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchAddressCount(dispatch, addressCounts)
      if (addressCounts && addressCounts.length > 0) {
        storeDateChartCache(ChartCachedKeys.AddressCount, addressCounts)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticAddressCountFetchEnd,
        payload: {
          statisticAddressCountsFetchEnd: true,
        },
      })
    })
}

export const getStatisticCellCount = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.CellCount)
  if (data) {
    dispatchCellCount(dispatch, data)
    return
  }
  fetchStatisticCellCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticCellCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const cellCounts = data.map(wrapper => ({
        liveCellsCount: wrapper.attributes.liveCellsCount,
        deadCellsCount: wrapper.attributes.deadCellsCount,
        allCellsCount: (
          Number(wrapper.attributes.liveCellsCount) + Number(wrapper.attributes.deadCellsCount)
        ).toString(),
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
      }))
      dispatchCellCount(dispatch, cellCounts)
      if (cellCounts && cellCounts.length > 0) {
        storeDateChartCache(ChartCachedKeys.CellCount, cellCounts)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticCellCountFetchEnd,
        payload: {
          statisticCellCountsFetchEnd: true,
        },
      })
    })
}

export const getStatisticAddressBalanceRank = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.AddressBalanceRank)
  if (data) {
    dispatchBalanceRank(dispatch, data)
    return
  }
  fetchStatisticAddressBalanceRank()
    .then((wrapper: Response.Wrapper<State.StatisticAddressBalanceRanking> | null) => {
      if (!wrapper) return
      const addressBalanceRanks = wrapper.attributes.addressBalanceRanking
      dispatchBalanceRank(dispatch, addressBalanceRanks)
      if (addressBalanceRanks && addressBalanceRanks.length > 0) {
        storeDateChartCache(ChartCachedKeys.AddressBalanceRank, addressBalanceRanks)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticAddressBalanceRankFetchEnd,
        payload: {
          statisticAddressBalanceRanksFetchEnd: true,
        },
      })
    })
}

export const getStatisticBalanceDistribution = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.BalanceDistribution)
  if (data) {
    dispatchBalanceDistribution(dispatch, data)
    return
  }
  fetchStatisticBalanceDistribution()
    .then((wrapper: Response.Wrapper<State.StatisticAddressBalanceDistribution> | null) => {
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
      dispatchBalanceDistribution(dispatch, balanceDistributions)
      if (balanceDistributions && balanceDistributions.length > 0) {
        storeDateChartCache(ChartCachedKeys.BalanceDistribution, balanceDistributions)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticBalanceDistributionFetchEnd,
        payload: {
          statisticBalanceDistributionsFetchEnd: true,
        },
      })
    })
}

export const getStatisticTxFeeHistory = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(ChartCachedKeys.TransactionFee)
  if (data) {
    dispatchTransactionFee(dispatch, data)
    return
  }
  fetchStatisticTxFeeHistory()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTransactionFee>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticTxFeeHistories: State.StatisticTransactionFee[] = data.map(wrapper => ({
        createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        totalTxFee: wrapper.attributes.totalTxFee,
      }))
      dispatchTransactionFee(dispatch, statisticTxFeeHistories)
      if (statisticTxFeeHistories && statisticTxFeeHistories.length > 0) {
        storeDateChartCache(ChartCachedKeys.TransactionFee, statisticTxFeeHistories)
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticTxFeeHistoryFetchEnd,
        payload: {
          statisticTxFeeHistoriesFetchEnd: true,
        },
      })
    })
}

export const getStatisticOccupiedCapacity = (dispatch: AppDispatch) => {
  fetchStatisticOccupiedCapacity()
    .then((response: Response.Response<Response.Wrapper<State.StatisticOccupiedCapacity>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticOccupiedCapacities = data.map(wrapper => wrapper.attributes)
      dispatch({
        type: PageActions.UpdateStatisticOccupiedCapacity,
        payload: {
          statisticOccupiedCapacities,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticOccupiedCapacityFetchEnd,
        payload: {
          statisticOccupiedCapacitiesFetchEnd: true,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateStatisticOccupiedCapacityFetchEnd,
        payload: {
          statisticOccupiedCapacitiesFetchEnd: true,
        },
      })
    })
}
