import { AxiosError } from 'axios'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'
import initAddress from '../../contexts/states/address'
import { fetchAddressInfo, fetchTipBlockNumber, fetchTransactionsByAddress } from '../http/fetcher'

const handleAddressStatus = (dispatch: AppDispatch, addressStatus: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateAddressStatus,
    payload: {
      addressStatus,
    },
  })
}

const handleTransactionStatus = (dispatch: AppDispatch, transactionsStatus: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateAddressTransactionsStatus,
    payload: {
      transactionsStatus,
    },
  })
}

export const getAddressInfo = (hash: string, dispatch: AppDispatch) => {
  handleAddressStatus(dispatch, 'InProgress')
  fetchAddressInfo(hash)
    .then((wrapper: Response.Wrapper<State.Address> | null) => {
      let { address } = initAddress
      if (wrapper) {
        address = {
          ...wrapper.attributes,
          type: wrapper.type === 'lock_hash' ? 'LockHash' : 'Address',
        }
      }
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address,
        },
      })
      handleAddressStatus(dispatch, 'OK')
    })
    .catch((error: AxiosError) => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: initAddress.address,
        },
      })
      const isEmptyAddress = error && error.response && error.response.status === 404
      handleAddressStatus(dispatch, isEmptyAddress ? 'OK' : 'Error')
    })
}

export const getTransactionsByAddress = (hash: string, page: number, size: number, dispatch: any) => {
  handleTransactionStatus(dispatch, 'InProgress')
  fetchTransactionsByAddress(hash, page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
      handleTransactionStatus(dispatch, 'OK')
    })
    .catch(error => {
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions: [],
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTotal,
        payload: {
          total: 0,
        },
      })
      const isEmptyAddress = error && error.response && error.response.status === 404
      handleTransactionStatus(dispatch, isEmptyAddress ? 'OK' : 'Error')
    })
}

export const getTipBlockNumber = (dispatch: AppDispatch) => {
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateTipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(wrapper.attributes.tipBlockNumber, 10),
        },
      })
    }
  })
}

export const getAddress = (identityHash: string, page: number, size: number, dispatch: any) => {
  getAddressInfo(identityHash, dispatch)
  getTransactionsByAddress(identityHash, page, size, dispatch)
}
