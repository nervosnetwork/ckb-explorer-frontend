import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import BlockHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { BlockDetailPanel } from './styled'
import { BlockComp, BlockOverview } from './BlockComp'
import { usePaginationParamsInPage } from '../../utils/hook'
import { explorerService } from '../../services/ExplorerService'
import { assert } from '../../utils/error'
import { QueryResult } from '../../components/QueryResult'
import { defaultBlockInfo } from './state'

export default () => {
  const { search } = useLocation()
  const { param: blockHeightOrHash } = useParams<{ param: string }>()
  const { currentPage, pageSize: pageSizeParam, setPage } = usePaginationParamsInPage()

  const filter = new URLSearchParams(search).get('filter')

  const queryBlock = useQuery(['block', blockHeightOrHash], async () => {
    const wrapper = await explorerService.api.fetchBlock(blockHeightOrHash)
    const block = wrapper.attributes
    return block
  })
  const blockHash = queryBlock.data?.blockHash
  const block = queryBlock.data ?? defaultBlockInfo

  const queryBlockTransactions = useQuery(
    ['block-transactions', blockHash, currentPage, pageSizeParam, filter],
    async () => {
      assert(blockHash != null)
      try {
        const { data, meta } = await explorerService.api.fetchTransactionsByBlockHash(blockHash, {
          page: currentPage,
          size: pageSizeParam,
          filter,
        })
        return {
          transactions: data.map(wrapper => wrapper.attributes),
          total: meta?.total ?? 0,
          pageSize: meta?.pageSize,
        }
      } catch (e) {
        console.error(e)
        return {
          transactions: [],
          total: 0,
        }
      }
    },
    {
      enabled: blockHash != null,
    },
  )

  const pageSize = queryBlockTransactions.data?.pageSize ?? pageSizeParam

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockHashCard title={i18n.t('block.block')} hash={blockHash ?? blockHeightOrHash}>
          <BlockOverview block={block} />
        </BlockHashCard>

        <QueryResult query={queryBlockTransactions} delayLoading>
          {data => (
            <BlockComp
              onPageChange={setPage}
              currentPage={currentPage}
              pageSize={pageSize}
              total={data.total}
              transactions={data.transactions}
            />
          )}
        </QueryResult>
      </BlockDetailPanel>
    </Content>
  )
}
