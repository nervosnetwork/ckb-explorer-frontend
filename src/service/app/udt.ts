import { fetchSimpleUDT, fetchSimpleUDTTransactions, fetchSimpleUDTTransactionsWithAddress } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'
import { deprecatedAddrToNewAddr } from '../../utils/util'

export const handleUDTStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateUDTStatus,
    payload: {
      status,
    },
  })
}

const handleFilterStatus = (dispatch: AppDispatch, filterStatus: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateUDTFilterStatus,
    payload: {
      filterStatus,
    },
  })
}

export const getSimpleUDT = (typeHash: string, dispatch: AppDispatch) => {
  handleUDTStatus(dispatch, 'InProgress')
  fetchSimpleUDT(typeHash)
    .then((wrapper: Response.Wrapper<State.UDT> | null) => {
      if (wrapper) {
        dispatch({
          type: PageActions.UpdateUDT,
          payload: {
            udt: wrapper.attributes,
          },
        })
        handleUDTStatus(dispatch, 'OK')
      } else {
        handleUDTStatus(dispatch, 'Error')
      }
    })
    .catch(() => {
      handleUDTStatus(dispatch, 'Error')
    })
}

export const getSimpleUDTTransactions = (typeHash: string, page: number, size: number, dispatch: AppDispatch) => {
  handleUDTStatus(dispatch, 'InProgress')
  fetchSimpleUDTTransactions(typeHash, page, size)
    .then((response: any) => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => ({
              ...wrapper.attributes,
              displayInputs: wrapper.attributes.displayInputs.map(input => ({
                ...input,
                addressHash: deprecatedAddrToNewAddr(input.addressHash),
              })),
              displayOutputs: wrapper.attributes.displayOutputs.map(output => ({
                ...output,
                addressHash: deprecatedAddrToNewAddr(output.addressHash),
              })),
            })) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateUDTTransactionsTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleUDTStatus(dispatch, 'OK')
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
      handleUDTStatus(dispatch, 'Error')
    })
}

export const getUDTTransactionsWithAddress = (
  address: string,
  typeHash: string,
  page: number,
  size: number,
  dispatch: AppDispatch,
) => {
  handleFilterStatus(dispatch, 'InProgress')
  fetchSimpleUDTTransactionsWithAddress(address, typeHash, page, size)
    .then((response: any) => {
      handleFilterStatus(dispatch, 'OK')
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateUDTTransactions,
        payload: {
          transactions: data.map((wrapper: Response.Wrapper<State.Transaction>) => wrapper.attributes) || [],
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
      handleFilterStatus(dispatch, 'Error')
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
