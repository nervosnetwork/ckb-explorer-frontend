import { fetchTransactionByHash } from '../http/fetcher'
import { PageActions, AppActions, AppDispatch } from '../../contexts/providers/reducer'

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
        dispatch({
          type: PageActions.UpdateTransactionStatus,
          payload: {
            status: 'OK',
          },
        })
        dispatch({
          type: AppActions.UpdateLoading,
          payload: {
            loading: false,
          },
        })
      } else {
        dispatch({
          type: PageActions.UpdateTransactionStatus,
          payload: {
            status: 'Error',
          },
        })
        dispatch({
          type: AppActions.UpdateLoading,
          payload: {
            loading: false,
          },
        })
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'Error',
        },
      })
    })
}

export default getTransactionByHash
