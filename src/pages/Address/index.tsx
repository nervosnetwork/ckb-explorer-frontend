import queryString from 'query-string'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loading from '../../components/Loading'
import AddressHashCard from '../../components/Card/AddressHashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { AppContext } from '../../contexts/providers/index'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { getAddress } from '../../service/app/address'
import { PageParams } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { AddressContentPanel } from './styled'
import AddressComp from './AddressComp'

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
    getAddress(address, currentPage, pageSize, dispatch)
  }, [address, currentPage, pageSize, dispatch])

  const AddressStateComp = () => {
    switch (addressState.status) {
      case 'error':
        return <Error />
      case 'ok':
        return <AddressComp currentPage={currentPage} pageSize={pageSize} address={address} />
      case 'none':
      default:
        return <Loading />
    }
  }

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressState.address.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          dispatch={dispatch}
        />
        <AddressStateComp />
      </AddressContentPanel>
    </Content>
  )
}

export default Address
