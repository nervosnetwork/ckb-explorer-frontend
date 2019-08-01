import { AppActions, AppDispatch, PageActions } from '../../contexts/providers/reducer'
import initAddress from '../../contexts/states/address'
import { fetchAddressInfo, fetchTipBlockNumber } from '../http/fetcher'
import { getTransactionsByAddress } from './transaction'

export const getAddressInfo = (hash: string, dispatch: any) => {
  fetchAddressInfo(hash)
    .then((wrapper: Response.Wrapper<State.Address>) => {
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
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: initAddress.address,
        },
      })
    })
}

export const getTipBlockNumber = (dispatch: AppDispatch) => {
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateTipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(wrapper.attributes.tip_block_number, 10),
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
