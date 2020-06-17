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
import { CachedKeys } from '../../../utils/const'
import {
  dispatchTransactionCount,
  dispatchAddressCount,
  dispatchCellCount,
  dispatchTransactionFee,
  dispatchBalanceRank,
  dispatchBalanceDistribution,
} from './action'

export const getStatisticTransactionCount = (dispatch: AppDispatch) => {
  const data = fetchDateChartCache(CachedKeys.TransactionCount)
  if (data) {
    dispatchTransactionCount(dispatch, data)
    return
  }
  fetchStatisticTransactionCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTransactionCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const transactionCounts = data.map(wrapper => {
        return {
          transactionsCount: wrapper.attributes.transactionsCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatchTransactionCount(dispatch, transactionCounts)
      storeDateChartCache(CachedKeys.TransactionCount, transactionCounts)
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
  const data = fetchDateChartCache(CachedKeys.AddressCount)
  if (data) {
    dispatchAddressCount(dispatch, data)
    return
  }
  fetchStatisticAddressCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticAddressCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const addressCounts = data.map(wrapper => {
        return {
          addressesCount: wrapper.attributes.addressesCount,
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatchAddressCount(dispatch, addressCounts)
      storeDateChartCache(CachedKeys.AddressCount, addressCounts)
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
  const data = fetchDateChartCache(CachedKeys.CellCount)
  if (data) {
    dispatchCellCount(dispatch, data)
    return
  }
  fetchStatisticCellCount()
    .then((response: Response.Response<Response.Wrapper<State.StatisticCellCount>[]> | null) => {
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
      dispatchCellCount(dispatch, cellCounts)
      storeDateChartCache(CachedKeys.CellCount, cellCounts)
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
  const data = fetchDateChartCache(CachedKeys.AddressBalanceRank)
  if (data) {
    dispatchBalanceRank(dispatch, data)
    return
  }
  fetchStatisticAddressBalanceRank()
    .then((wrapper: Response.Wrapper<State.StatisticAddressBalanceRanking> | null) => {
      if (!wrapper) return
      const addressBalanceRanks = wrapper.attributes.addressBalanceRanking
      dispatchBalanceRank(dispatch, addressBalanceRanks)
      storeDateChartCache(CachedKeys.AddressBalanceRank, addressBalanceRanks)
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
  const data = fetchDateChartCache(CachedKeys.BalanceDistribution)
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
      storeDateChartCache(CachedKeys.BalanceDistribution, balanceDistributions)
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
  const data = fetchDateChartCache(CachedKeys.TransactionFee)
  if (data) {
    dispatchTransactionFee(dispatch, data)
    return
  }
  fetchStatisticTxFeeHistory()
    .then((response: Response.Response<Response.Wrapper<State.StatisticTransactionFee>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticTxFeeHistories: State.StatisticTransactionFee[] = data.map(wrapper => {
        return {
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
          totalTxFee: wrapper.attributes.totalTxFee,
        }
      })
      dispatchTransactionFee(dispatch, statisticTxFeeHistories)
      storeDateChartCache(CachedKeys.TransactionFee, statisticTxFeeHistories)
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
