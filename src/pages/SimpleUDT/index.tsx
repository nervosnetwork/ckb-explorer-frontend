import queryString from 'query-string'
import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { PageActions, AppActions } from '../../contexts/providers/reducer'
import { getAddress, getTipBlockNumber } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { SimpleUDTContentPanel } from './styled'
import { SimpleUDTOverview, SimpleUDTTransactions } from './SimpleUDTComp'
import browserHistory from '../../routes/history'
import { useTimeoutWithUnmount } from '../../utils/hook'

const SimpleUDTStateOverview = () => {
  const { addressState, app } = useAppState()
  switch (addressState.addressStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <SimpleUDTOverview />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

const SimpleUDTStateTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const { addressState, app } = useAppState()
  switch (addressState.transactionsStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <SimpleUDTTransactions currentPage={currentPage} pageSize={pageSize} address={address} />
    case 'None':
    default:
      return <Loading show={app.secondLoading} />
  }
}

export const SimpleUDT = () => {
  const dispatch = useDispatch()
  const { search } = useLocation()
  const { hash: typeHash } = useParams<{ hash: string }>()
  const parsed = queryString.parse(search)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    getTipBlockNumber(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      browserHistory.replace(`/address/${typeHash}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getAddress(typeHash, currentPage, pageSize, dispatch)
  }, [typeHash, currentPage, pageSize, dispatch])

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
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard title={i18n.t('udt.sudt')} hash={typeHash} />
        <SimpleUDTStateOverview />
        <SimpleUDTStateTransactions currentPage={currentPage} pageSize={pageSize} address={typeHash} />
      </SimpleUDTContentPanel>
    </Content>
  )
}

export default SimpleUDT
