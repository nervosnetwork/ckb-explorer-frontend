import { AxiosError } from 'axios'
import { AppActions, AppDispatch, PageActions } from '../../contexts/providers/reducer'
import initAddress from '../../contexts/states/address'
import { fetchAddressInfo, fetchTipBlockNumber, fetchTransactionsByAddress } from '../http/fetcher'

const handleAddressResponseStatus = (dispatch: AppDispatch, isOK: boolean | undefined) => {
  dispatch({
    type: PageActions.UpdateAddressStatus,
    payload: {
      addressStatus: isOK ? 'OK' : 'Error',
    },
  })
  dispatch({
    type: AppActions.UpdateLoading,
    payload: {
      loading: false,
    },
  })
}

const handleTransactionResponseStatus = (dispatch: AppDispatch, isOK: boolean) => {
  dispatch({
    type: PageActions.UpdateAddressTransactionsStatus,
    payload: {
      transactionsStatus: isOK ? 'OK' : 'Error',
    },
  })
  dispatch({
    type: AppActions.UpdateSecondLoading,
    payload: {
      loading: false,
    },
  })
}

export const getAddressInfo = (hash: string, dispatch: AppDispatch) => {
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
      handleAddressResponseStatus(dispatch, true)
    })
    .catch((error: AxiosError) => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: initAddress.address,
        },
      })
      handleAddressResponseStatus(dispatch, error && error.response && error.response.status === 404)
    })
}

export const getTransactionsByAddress = (hash: string, page: number, size: number, dispatch: any) => {
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
      handleTransactionResponseStatus(dispatch, true)
    })
    .catch(() => {
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
      handleTransactionResponseStatus(dispatch, false)
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
  getTipBlockNumber(dispatch)
}
