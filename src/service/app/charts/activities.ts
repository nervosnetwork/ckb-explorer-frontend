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

export const getStatisticTransactionCount = (dispatch: AppDispatch) => {
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
      dispatch({
        type: PageActions.UpdateStatisticTransactionCount,
        payload: {
          statisticTransactionCounts: transactionCounts,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticTransactionCountFetchEnd,
        payload: {
          statisticTransactionCountsFetchEnd: true,
        },
      })
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
      dispatch({
        type: PageActions.UpdateStatisticAddressCount,
        payload: {
          statisticAddressCounts: addressCounts,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticAddressCountFetchEnd,
        payload: {
          statisticAddressCountsFetchEnd: true,
        },
      })
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
      dispatch({
        type: PageActions.UpdateStatisticCellCount,
        payload: {
          statisticCellCounts: cellCounts,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticCellCountFetchEnd,
        payload: {
          statisticCellCountsFetchEnd: true,
        },
      })
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
  fetchStatisticAddressBalanceRank()
    .then((wrapper: Response.Wrapper<State.StatisticAddressBalanceRanking> | null) => {
      if (!wrapper) return
      const addressBalanceRanks = wrapper.attributes.addressBalanceRanking
      dispatch({
        type: PageActions.UpdateStatisticAddressBalanceRank,
        payload: {
          statisticAddressBalanceRanks: addressBalanceRanks,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticAddressBalanceRankFetchEnd,
        payload: {
          statisticAddressBalanceRanksFetchEnd: true,
        },
      })
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
      dispatch({
        type: PageActions.UpdateStatisticBalanceDistribution,
        payload: {
          statisticBalanceDistributions: balanceDistributions,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticBalanceDistributionFetchEnd,
        payload: {
          statisticBalanceDistributionsFetchEnd: true,
        },
      })
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
      dispatch({
        type: PageActions.UpdateStatisticTxFeeHistory,
        payload: {
          statisticTxFeeHistories,
        },
      })
      dispatch({
        type: PageActions.UpdateStatisticTxFeeHistoryFetchEnd,
        payload: {
          statisticTxFeeHistoriesFetchEnd: true,
        },
      })
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
