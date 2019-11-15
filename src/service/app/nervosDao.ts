import {
  fetchNervosDao,
  fetchNervosDaoTransactions,
  fetchNervosDaoTransactionsByHash,
  fetchNervosDaoTransactionsByAddress,
  fetchNervosDaoDepositors,
} from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'
import { addPrefixForHash } from '../../utils/string'

const handleTransactionsResponse = (dispatch: AppDispatch, transactions: State.Transaction[], total: number) => {
  dispatch({
    type: PageActions.UpdateNervosDaoTransactions,
    payload: {
      transactions,
    },
  })
  dispatch({
    type: PageActions.UpdateNervosDaoTransactionsTotal,
    payload: {
      total,
    },
  })
}

export const getNervosDao = (dispatch: AppDispatch) => {
  fetchNervosDao().then((wrapper: Response.Wrapper<State.NervosDao> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateNervosDao,
        payload: {
          nervosDao: wrapper.attributes,
        },
      })
    }
  })
}

export const getNervosDaoTransactions = (dispatch: AppDispatch, page: number, pageSize: number) => {
  fetchNervosDaoTransactions(page, pageSize).then((response: any) => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
    handleTransactionsResponse(
      dispatch,
      data.map((wrapper: Response.Wrapper<State.Transaction>) => {
        return wrapper.attributes
      }),
      meta === undefined ? 1 : meta.total,
    )
  })
}

export const searchNervosDaoTransactions = (keyword: string, dispatch: AppDispatch, callback: Function) => {
  if (keyword.startsWith('ckt') || keyword.startsWith('ckb')) {
    fetchNervosDaoTransactionsByAddress(keyword)
      .then((response: any) => {
        callback(true)
        const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
        handleTransactionsResponse(
          dispatch,
          data.map((wrapper: Response.Wrapper<State.Transaction>) => {
            return wrapper.attributes
          }),
          meta === undefined ? 1 : meta.total,
        )
      })
      .catch(() => {
        callback(false)
      })
  } else {
    fetchNervosDaoTransactionsByHash(addPrefixForHash(keyword))
      .then((wrapper: any) => {
        callback(true)
        const { attributes } = wrapper as Response.Wrapper<State.Transaction>
        handleTransactionsResponse(dispatch, [attributes], 1)
      })
      .catch(() => {
        callback(false)
      })
  }
}

export const getNervosDaoDepositors = (dispatch: AppDispatch) => {
  fetchNervosDaoDepositors().then((response: any) => {
    const { data } = response as Response.Response<Response.Wrapper<State.NervosDaoDepositor>[]>
    dispatch({
      type: PageActions.UpdateNervosDaoDepositors,
      payload: {
        depositors: data.map((wrapper: Response.Wrapper<State.NervosDaoDepositor>) => {
          return wrapper.attributes
        }),
      },
    })
  })
}
