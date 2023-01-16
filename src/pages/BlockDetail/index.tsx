import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import BlockHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import Error from '../../components/Error'
import { useDispatch, useAppState } from '../../contexts/providers'
import { getBlock, handleBlockStatus } from '../../service/app/block'
import { LOADING_WAITING_TIME } from '../../constants/common'
import i18n from '../../utils/i18n'
import { BlockDetailPanel } from './styled'
import { BlockComp, BlockOverview } from './BlockComp'
import Loading from '../../components/Loading'
import { useDelayLoading, usePaginationParamsInPage } from '../../utils/hook'

const BlockStateComp = ({
  currentPage,
  pageSize,
  blockParam,
}: {
  currentPage: number
  pageSize: number
  blockParam: string
}) => {
  const {
    blockState: { status },
  } = useAppState()
  const loading = useDelayLoading(LOADING_WAITING_TIME, status === 'None' || status === 'InProgress')

  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <BlockComp currentPage={currentPage} pageSize={pageSize} blockParam={blockParam} />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={loading} />
  }
}

export default () => {
  const dispatch = useDispatch()
  const { hash } = useLocation()
  // blockParam: block hash or block number
  const { param: blockParam } = useParams<{ param: string }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()
  const {
    blockState: { status, block },
  } = useAppState()

  useEffect(() => {
    getBlock(blockParam, currentPage, pageSize, dispatch)
  }, [blockParam, currentPage, pageSize, dispatch])

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

  useEffect(() => {
    return () => handleBlockStatus(dispatch, 'None')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
