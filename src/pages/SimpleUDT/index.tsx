import queryString from 'query-string'
import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { PageActions, AppActions } from '../../contexts/providers/reducer'
import { getTipBlockNumber } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { SimpleUDTContentPanel } from './styled'
import SimpleUDTComp from './SimpleUDTComp'
import browserHistory from '../../routes/history'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { getSimpleUDT, getSimpleUDTTransactions } from '../../service/app/udt'
import SUDTTokenIcon from '../../assets/sudt_token.png'

const SimpleUDTCompState = ({
  currentPage,
  pageSize,
  typeHash,
}: {
  currentPage: number
  pageSize: number
  typeHash: string
}) => {
  const {
    udtState: { status },
    app,
  } = useAppState()
  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <SimpleUDTComp currentPage={currentPage} pageSize={pageSize} typeHash={typeHash} />
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
  const {
    udtState: {
      udt: { iconFile },
    },
  } = useAppState()

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    getTipBlockNumber(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      browserHistory.replace(`/sudt/${typeHash}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getSimpleUDT(typeHash, dispatch)
    getSimpleUDTTransactions(typeHash, currentPage, pageSize, dispatch)
  }, [typeHash, currentPage, pageSize, dispatch])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: true,
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateUDTStatus,
        payload: {
          addressStatus: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard title={i18n.t('udt.sudt')} hash={typeHash} iconUri={iconFile ? iconFile : SUDTTokenIcon} />
        <SimpleUDTCompState currentPage={currentPage} pageSize={pageSize} typeHash={typeHash} />
      </SimpleUDTContentPanel>
    </Content>
  )
}

export default SimpleUDT
