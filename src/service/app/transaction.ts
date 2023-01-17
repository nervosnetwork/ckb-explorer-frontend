import { fetchTransactionByHash, fetchTransactions, fetchLatestTransactions } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'

export const handleTransactionStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateTransactionStatus,
    payload: {
      status,
    },
  })
}

export const getTransactionByHash = (hash: string, dispatch: AppDispatch) => {
  handleTransactionStatus(dispatch, 'InProgress')
  fetchTransactionByHash(hash)
    .then((wrapper: Response.Wrapper<State.Transaction> | null) => {
      if (wrapper) {
        const transactionValue = wrapper.attributes
        if (transactionValue.displayOutputs && transactionValue.displayOutputs.length > 0) {
          transactionValue.displayOutputs[0].isGenesisOutput = transactionValue.blockNumber === 0
        }
        dispatch({
          type: PageActions.UpdateTransaction,
          payload: {
            transaction: transactionValue,
          },
        })
        handleTransactionStatus(dispatch, 'OK')
      } else {
        handleTransactionStatus(dispatch, 'Error')
      }
    })
    .catch(() => {
      handleTransactionStatus(dispatch, 'Error')
    })
}

export const getTransactions = (page: number, size: number, dispatch: AppDispatch) => {
  handleTransactionStatus(dispatch, 'InProgress')
  fetchTransactions(page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateTransactions,
        payload: {
          transactions: data.map((wrapper: Response.Wrapper<State.Transaction>) => wrapper.attributes) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleTransactionStatus(dispatch, 'OK')
    })
    .catch(() => {
      handleTransactionStatus(dispatch, 'Error')
    })
}

export const getLatestTransactions = (dispatch: AppDispatch) => {
  handleTransactionStatus(dispatch, 'InProgress')
  fetchLatestTransactions()
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateTransactions,
        payload: {
          transactions: data.map((wrapper: Response.Wrapper<State.Transaction>) => wrapper.attributes) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleTransactionStatus(dispatch, 'OK')
    })
    .catch(() => {
      handleTransactionStatus(dispatch, 'Error')
    })
}
