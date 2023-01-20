import { fetchStatisticTransactionCount, fetchStatisticTxFeeHistory } from '../../http/fetcher'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { fetchDateChartCache, storeDateChartCache } from '../../../utils/cache'
import { ChartCachedKeys } from '../../../constants/cache'
import { dispatchTransactionCount, dispatchTransactionFee } from './action'

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
