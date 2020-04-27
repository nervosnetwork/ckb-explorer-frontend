import { fetchSimpleUDT, fetchSimpleUDTTransactions, fetchSimpleUDTTransactionsWithAddress } from '../http/fetcher'
import { AppDispatch, PageActions, AppActions } from '../../contexts/providers/reducer'

const handleResponseStatus = (dispatch: AppDispatch, isOK: boolean) => {
  dispatch({
    type: PageActions.UpdateUDTStatus,
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

export const getSimpleUDT = (typeHash: string, dispatch: AppDispatch) => {
  fetchSimpleUDT(typeHash).then((wrapper: Response.Wrapper<State.UDT> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateUDT,
        payload: {
          udt: wrapper.attributes,
        },
      })
    }
  })
}

export const getSimpleUDTTransactions = (typeHash: string, page: number, size: number, dispatch: AppDispatch) => {
  fetchSimpleUDTTransactions(typeHash, page, size)
    .then((response: any) => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateUDTTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleResponseStatus(dispatch, true)
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions: [],
        },
      })
      dispatch({
        type: PageActions.UpdateUDTTransactionsTotal,
        payload: {
          total: 0,
        },
      })
      handleResponseStatus(dispatch, false)
    })
}

export const getSimpleUDTTransactionsWithAddress = (
  address: string,
  typeHash: string,
  page: number,
  size: number,
  dispatch: AppDispatch,
  callback: Function,
) => {
  fetchSimpleUDTTransactionsWithAddress(address, typeHash, page, size)
    .then((response: any) => {
      callback(true)
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateUDTTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleResponseStatus(dispatch, true)
    })
    .catch(() => {
      callback(false)
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions: [],
        },
      })
      dispatch({
        type: PageActions.UpdateUDTTransactionsTotal,
        payload: {
          total: 0,
        },
      })
      handleResponseStatus(dispatch, true)
    })
}
