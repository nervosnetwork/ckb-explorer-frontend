import { fetchAddressInfo } from '../http/fetcher'
import { PageActions } from '../../contexts/providers/reducer'
import initAddress from '../../contexts/states/address'
import { triggerTransactionsByAddress } from './transaction'
import { triggerTipBlockNumber } from './block'

export const triggerAddressInfo = (hash: string, dispatch: any) => {
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

export const triggerAddress = ({
  identityHash,
  page,
  size,
  dispatch,
}: {
  identityHash: string
  page: number
  size: number
  dispatch: any
}) => {
  triggerAddressInfo(identityHash, dispatch)
  triggerTransactionsByAddress(identityHash, page, size, dispatch)
  triggerTipBlockNumber(dispatch)
}
