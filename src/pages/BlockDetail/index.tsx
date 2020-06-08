import queryString from 'query-string'
import React, { useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import BlockHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import Error from '../../components/Error'
import { useDispatch, useAppState } from '../../contexts/providers'
import { PageActions, AppActions } from '../../contexts/actions'
import { getBlock } from '../../service/app/block'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { BlockDetailPanel } from './styled'
import { BlockComp, BlockOverview } from './BlockComp'
import Loading from '../../components/Loading'
import { useTimeoutWithUnmount } from '../../utils/hook'

const BlockStateComp = ({
  currentPage,
  pageSize,
  blockParam,
}: {
  currentPage: number
  pageSize: number
  blockParam: string
}) => {
  const { blockState, app } = useAppState()
  switch (blockState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <BlockComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

export default () => {
  const dispatch = useDispatch()
  const { replace } = useHistory()
  const { search, hash } = useLocation()
  // blockParam: block hash or block number
  const { param: blockParam } = useParams<{ param: string }>()
  const parsed = queryString.parse(search)
  const {
    blockState: { status, block },
  } = useAppState()

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, currentPage, pageSize, dispatch)
  }, [replace, blockParam, currentPage, pageSize, dispatch])

  useEffect(() => {
    let anchor = hash
    if (anchor) {
      anchor = anchor.replace('#', '')
      const anchorElement = document.getElementById(anchor)
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    }
  }, [hash])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: status === 'None' || status === 'InProgress',
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateBlockStatus,
        payload: {
          status: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockHashCard title={i18n.t('block.block')} hash={status === 'OK' ? block.blockHash : blockParam}>
          <BlockOverview />
        </BlockHashCard>
        <BlockStateComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} />
      </BlockDetailPanel>
    </Content>
  )
}
