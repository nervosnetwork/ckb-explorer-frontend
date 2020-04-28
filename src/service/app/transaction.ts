import { fetchTransactionByHash, fetchTransactions, fetchLatestTransactions } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'

const handleResponseStatus = (dispatch: AppDispatch, isOK: boolean) => {
  dispatch({
    type: PageActions.UpdateTransactionStatus,
    payload: {
      status: isOK ? 'OK' : 'Error',
    },
  })
  dispatch({
    type: AppActions.UpdateLoading,
    payload: {
      loading: false,
    },
  })
}

export const getTransactionByHash = (hash: string, dispatch: AppDispatch, callback: Function) => {
  fetchTransactionByHash(hash)
    .then((wrapper: Response.Wrapper<State.Transaction> | null) => {
      callback()
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
        handleResponseStatus(dispatch, true)
      } else {
        handleResponseStatus(dispatch, false)
      }
    })
    .catch(() => {
      callback()
      handleResponseStatus(dispatch, false)
    })
}

export const getTransactions = (page: number, size: number, dispatch: AppDispatch) => {
  fetchTransactions(page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleResponseStatus(dispatch, true)
    })
    .catch(() => {
      handleResponseStatus(dispatch, false)
    })
}

export const getLatestTransactions = (dispatch: AppDispatch) => {
  fetchLatestTransactions()
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleResponseStatus(dispatch, true)
    })
    .catch(() => {
      handleResponseStatus(dispatch, false)
    })
}
