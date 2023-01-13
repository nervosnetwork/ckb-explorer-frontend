import { fetchTransactionByHash } from '../http/fetcher'
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
