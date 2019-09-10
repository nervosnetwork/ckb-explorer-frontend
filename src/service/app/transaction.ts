import { fetchTransactionByHash } from '../http/fetcher'
import { PageActions, AppActions, AppDispatch } from '../../contexts/providers/reducer'

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

export const getTransactionByHash = (hash: string, dispatch: AppDispatch) => {
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
        handleResponseStatus(dispatch, true)
      } else {
        handleResponseStatus(dispatch, false)
      }
    })
    .catch(() => {
      handleResponseStatus(dispatch, false)
    })
}

export default getTransactionByHash
