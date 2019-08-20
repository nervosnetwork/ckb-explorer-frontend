import queryString from 'query-string'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AddressHashCard from '../../components/Card/AddressHashCard'
import Content from '../../components/Content'
import Error from '../../components/Error'
import { AppContext } from '../../contexts/providers'
import { StateWithDispatch, PageActions } from '../../contexts/providers/reducer'
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
}: {
  currentPage: number
  pageSize: number
  blockParam: string
}) => {
  const { blockState } = useContext(AppContext)
  switch (blockState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <BlockComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} />
    case 'KeepNone':
      return <Loading />
    case 'None':
    default:
      return null
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
          type: PageActions.UpdateBlockStatus,
          payload: {
            status: 'KeepNone',
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
        <AddressHashCard
          title={i18n.t('block.block')}
          hash={blockState.status === 'OK' ? blockState.block.blockHash : blockParam}
          dispatch={dispatch}
        />
        <BlockStateComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} />
      </BlockDetailPanel>
    </Content>
  )
}
