import { AxiosError } from 'axios'
import { AppActions, AppDispatch, PageActions, AppDispatchType } from '../../contexts/providers/reducer'
import initAddress from '../../contexts/states/address'
import { fetchAddressInfo, fetchTipBlockNumber } from '../http/fetcher'
import { getTransactionsByAddress } from './transaction'
import { FetchStatus } from '../../contexts/states'

export const getAddressInfo = (
  hash: string,
  dispatch: AppDispatchType<{ address?: State.Address; status?: FetchStatus }>,
) => {
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
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          status: 'OK' as FetchStatus,
        },
      })
    })
    .catch((error: AxiosError) => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: initAddress.address,
        },
      })
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          status: error && error.response && error.response.status === 404 ? 'OK' : 'Error',
        },
      })
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
