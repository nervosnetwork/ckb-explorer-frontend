import { fetchAddressInfo } from '../http/fetcher'
import { PageActions } from '../../contexts/providers/reducer'
import initAddress from '../../contexts/states/address'
import { getTransactionsByAddress } from './transaction'
import { getTipBlockNumber } from './block'

export const getAddressInfo = (hash: string, dispatch: any) => {
  fetchAddressInfo(hash)
    .then((wrapper: Response.Wrapper<State.Address>) => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: wrapper ? wrapper.attributes : initAddress,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateAddress,
        payload: {
          address: initAddress,
        },
      })
    })
}

export const getAddress = (identityHash: string, page: number, size: number, dispatch: any) => {
  getAddressInfo(identityHash, dispatch)
  getTransactionsByAddress(identityHash, page, size, dispatch)
  getTipBlockNumber(dispatch)
}
