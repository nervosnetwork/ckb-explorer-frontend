import { fetchTransactionByHash, fetchTransactions, fetchLatestTransactions } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'

const handleStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateTransactionStatus,
    payload: {
      status,
    },
  })
  dispatch({
    type: AppActions.UpdateLoading,
    payload: {
      loading: false,
    },
  })
}

export const getTransactionByHash = (hash: string, dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
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
        handleStatus(dispatch, 'OK')
      } else {
        handleStatus(dispatch, 'Error')
      }
    })
    .catch(() => {
      handleStatus(dispatch, 'Error')
    })
}

export const getTransactions = (page: number, size: number, dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
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
      handleStatus(dispatch, 'OK')
    })
    .catch(() => {
      handleStatus(dispatch, 'Error')
    })
}

export const getLatestTransactions = (dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
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
      handleStatus(dispatch, 'OK')
    })
    .catch(() => {
      handleStatus(dispatch, 'Error')
    })
}
