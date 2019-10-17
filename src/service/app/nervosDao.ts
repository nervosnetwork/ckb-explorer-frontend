import { fetchNervosDao, fetchNervosDaoTransactions } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'

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

export const getNervosDaoTransactions = (dispatch: AppDispatch) => {
  fetchNervosDaoTransactions().then((response: Response.Response<Response.Wrapper<State.Transaction>[]> | null) => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
    dispatch({
      type: PageActions.UpdateNervosDaoTransactions,
      payload: {
        transactions: data.map((wrapper: Response.Wrapper<State.Transaction>) => {
          return wrapper.attributes
        }),
      },
    })
    if (meta) {
      dispatch({
        type: PageActions.UpdateNervosDaoTransactionsTotal,
        payload: {
          total: meta.total,
        },
      })
    }
  })
}
