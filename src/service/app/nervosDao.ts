import {
  fetchNervosDao,
  fetchNervosDaoTransactions,
  fetchNervosDaoTransactionsByHash,
  fetchNervosDaoTransactionsByAddress,
  fetchNervosDaoDepositors,
} from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'
import { addPrefixForHash } from '../../utils/string'

const handleNervosDAOStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateNervosDaoStatus,
    payload: {
      status,
    },
  })
}

const handleTransactionsStatus = (dispatch: AppDispatch, transactionsStatus: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateNervosDaoTransactionsStatus,
    payload: {
      transactionsStatus,
    },
  })
}

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
  handleNervosDAOStatus(dispatch, 'InProgress')
  fetchNervosDao()
    .then((wrapper: Response.Wrapper<State.NervosDao> | null) => {
      if (wrapper) {
        dispatch({
          type: PageActions.UpdateNervosDao,
          payload: {
            nervosDao: wrapper.attributes,
          },
        })
      } else {
        handleNervosDAOStatus(dispatch, 'Error')
      }
    })
    .catch(() => {
      handleNervosDAOStatus(dispatch, 'Error')
    })
}

export const getNervosDaoTransactions = (dispatch: AppDispatch, page: number, pageSize: number) => {
  handleNervosDAOStatus(dispatch, 'InProgress')
  fetchNervosDaoTransactions(page, pageSize)
    .then((response: any) => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      handleTransactionsResponse(
        dispatch,
        data.map((wrapper: Response.Wrapper<State.Transaction>) => {
          return wrapper.attributes
        }),
        meta === undefined ? 1 : meta.total,
      )
      handleNervosDAOStatus(dispatch, 'OK')
    })
    .catch(() => {
      handleNervosDAOStatus(dispatch, 'Error')
    })
}

export const searchNervosDaoTransactions = (keyword: string, dispatch: AppDispatch) => {
  handleTransactionsStatus(dispatch, 'InProgress')
  if (keyword.startsWith('ckt') || keyword.startsWith('ckb')) {
    fetchNervosDaoTransactionsByAddress(keyword)
      .then((response: any) => {
        handleTransactionsStatus(dispatch, 'OK')
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
        handleTransactionsStatus(dispatch, 'Error')
      })
  } else {
    fetchNervosDaoTransactionsByHash(addPrefixForHash(keyword))
      .then((wrapper: any) => {
        handleTransactionsStatus(dispatch, 'OK')
        const { attributes } = wrapper as Response.Wrapper<State.Transaction>
        handleTransactionsResponse(dispatch, [attributes], 1)
      })
      .catch(() => {
        handleTransactionsStatus(dispatch, 'Error')
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
