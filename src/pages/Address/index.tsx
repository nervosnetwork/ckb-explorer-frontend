import queryString from 'query-string'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loading from '../../components/Loading'
import AddressHashCard from '../../components/Card/AddressHashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { AppContext } from '../../contexts/providers/index'
import { PageActions, StateWithDispatchType } from '../../contexts/providers/reducer'
import { getAddress } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { AddressContentPanel } from './styled'
import AddressComp from './AddressComp'
import browserHistory from '../../routes/history'
import { FetchStatus } from '../../contexts/states'
import { useTimeoutWithUnmount } from '../../utils/hook'

const AddressStateComp = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const { addressState } = useContext(AppContext)
  switch (addressState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressComp currentPage={currentPage} pageSize={pageSize} address={address} />
    case 'KeepNone':
      return <Loading />
    case 'None':
    default:
      return null
  }
}

export const Address = ({
  dispatch,
  location: { search },
  match: { params },
}: React.PropsWithoutRef<
  StateWithDispatchType<{ status: FetchStatus }> & RouteComponentProps<{ address: string }>
>) => {
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
      if (addressState.status === 'None') {
        dispatch({
          type: PageActions.UpdateAddressStatus,
          payload: {
            status: 'KeepNone',
          },
        })
      }
    },
    () => {
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          status: 'None',
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
        <AddressStateComp currentPage={currentPage} pageSize={pageSize} address={address} />
      </AddressContentPanel>
    </Content>
  )
}

export default Address
