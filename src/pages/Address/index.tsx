import queryString from 'query-string'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loading from '../../components/Loading'
import AddressHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { AppContext } from '../../contexts/providers/index'
import { PageActions, AppActions, StateWithDispatch, AppDispatch } from '../../contexts/providers/reducer'
import { getAddress } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { AddressContentPanel } from './styled'
import { AddressOverview, AddressTransactions } from './AddressComp'
import browserHistory from '../../routes/history'
import { useTimeoutWithUnmount } from '../../utils/hook'

const AddressStateOverview = ({ dispatch }: { dispatch: AppDispatch }) => {
  const { addressState, app } = useContext(AppContext)
  switch (addressState.addressStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressOverview dispatch={dispatch} />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

const AddressStateTransactions = ({
  currentPage,
  pageSize,
  address,
  dispatch,
}: {
  currentPage: number
  pageSize: number
  address: string
  dispatch: AppDispatch
}) => {
  const { addressState, app } = useContext(AppContext)
  switch (addressState.transactionsStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressTransactions currentPage={currentPage} pageSize={pageSize} address={address} dispatch={dispatch} />
    case 'None':
    default:
      return <Loading show={app.secondLoading} />
  }
}

export const Address = ({
  dispatch,
  location: { search },
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ address: string }>>) => {
  const { address } = params
  const parsed = queryString.parse(search)
  const { addressState } = useContext(AppContext)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      browserHistory.replace(`/address/${address}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getAddress(address, currentPage, pageSize, dispatch)
  }, [address, currentPage, pageSize, dispatch])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: true,
        },
      })
      dispatch({
        type: AppActions.UpdateSecondLoading,
        payload: {
          secondLoading: true,
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          addressStatus: 'None',
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTransactionsStatus,
        payload: {
          transactionsStatus: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressState.address.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          dispatch={dispatch}
        />
        <AddressStateOverview dispatch={dispatch} />
        <AddressStateTransactions currentPage={currentPage} pageSize={pageSize} address={address} dispatch={dispatch} />
      </AddressContentPanel>
    </Content>
  )
}

export default Address
