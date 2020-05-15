import { fetchSimpleUDT, fetchSimpleUDTTransactions, fetchSimpleUDTTransactionsWithAddress } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'

const handleStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateUDTStatus,
    payload: {
      status,
    },
  })
}

export const getSimpleUDT = (typeHash: string, dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
  fetchSimpleUDT(typeHash)
    .then((wrapper: Response.Wrapper<State.UDT> | null) => {
      if (wrapper) {
        dispatch({
          type: PageActions.UpdateUDT,
          payload: {
            udt: wrapper.attributes,
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

export const getSimpleUDTTransactions = (typeHash: string, page: number, size: number, dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
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
      handleStatus(dispatch, 'OK')
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
      handleStatus(dispatch, 'Error')
    })
}

export const getUDTTransactionsWithAddress = (
  address: string,
  typeHash: string,
  page: number,
  size: number,
  dispatch: AppDispatch,
) => {
  handleStatus(dispatch, 'InProgress')
  fetchSimpleUDTTransactionsWithAddress(address, typeHash, page, size)
    .then((response: any) => {
      handleStatus(dispatch, 'OK')
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
    })
    .catch(() => {
      handleStatus(dispatch, 'Error')
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
    })
}
