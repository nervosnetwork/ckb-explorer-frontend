import { fetchTransactionsByAddress, fetchTransactionByHash } from '../http/fetcher'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'

export const triggerTransactionsByAddress = (hash: string, page: number, size: number, dispatch: any) => {
  fetchTransactionsByAddress(hash, page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions: data || [],
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions: [],
        },
      })
    })
}

export const triggerTransactionByHash = ({
  hash,
  replace,
  dispatch,
}: {
  hash: string
  replace: any
  dispatch: AppDispatch
}) => {
  fetchTransactionByHash(hash)
    .then((wrapper: Response.Wrapper<State.Transaction>) => {
      if (wrapper) {
        const transactionValue = wrapper.attributes
        if (transactionValue.display_outputs && transactionValue.display_outputs.length > 0) {
          transactionValue.display_outputs[0].isGenesisOutput = transactionValue.block_number === 0
        }
        dispatch({
          type: PageActions.UpdateTransaction,
          payload: {
            transaction: transactionValue,
          },
        })
      } else {
        replace(`/search/fail?q=${hash}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${hash}`)
    })
}
