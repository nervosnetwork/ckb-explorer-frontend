import queryString from 'query-string'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import BlockHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import Error from '../../components/Error'
import { AppContext } from '../../contexts/providers'
import { StateWithDispatch, PageActions, AppActions, AppDispatch } from '../../contexts/providers/reducer'
import { getBlock } from '../../service/app/block'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { BlockDetailPanel } from './styled'
import BlockComp from './BlockComp'
import Loading from '../../components/Loading'
import { useTimeoutWithUnmount } from '../../utils/hook'

const BlockStateComp = ({
  currentPage,
  pageSize,
  blockParam,
  dispatch,
}: {
  currentPage: number
  pageSize: number
  blockParam: string
  dispatch: AppDispatch
}) => {
  const { blockState, app } = useContext(AppContext)
  switch (blockState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <BlockComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} dispatch={dispatch} />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

export default ({
  dispatch,
  history: { replace },
  match: { params },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ param: string }>>) => {
  // blockParam: block hash or block number
  const { param: blockParam } = params
  const parsed = queryString.parse(search)
  const { blockState } = useContext(AppContext)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, currentPage, pageSize, dispatch)
  }, [replace, blockParam, currentPage, pageSize, dispatch])

  useTimeoutWithUnmount(
    () => {
      if (blockState.status === 'None') {
        dispatch({
          type: AppActions.UpdateLoading,
          payload: {
            loading: true,
          },
        })
      }
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
        <BlockHashCard
          title={i18n.t('block.block')}
          hash={blockState.status === 'OK' ? blockState.block.blockHash : blockParam}
          dispatch={dispatch}
        />
        <BlockStateComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} dispatch={dispatch} />
      </BlockDetailPanel>
    </Content>
  )
}
