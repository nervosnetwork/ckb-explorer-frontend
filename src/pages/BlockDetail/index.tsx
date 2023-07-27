import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import BlockHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { BlockDetailPanel } from './styled'
import { BlockComp, BlockOverview } from './BlockComp'
import { usePaginationParamsInPage } from '../../utils/hook'
import { fetchBlock, fetchTransactionsByBlockHash } from '../../service/http/fetcher'
import { assert } from '../../utils/error'
import { QueryResult } from '../../components/QueryResult'
import { defaultBlockInfo } from './state'

export default () => {
  const { param: blockHeightOrHash } = useParams<{ param: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const queryBlock = useQuery(['block', blockHeightOrHash], async () => {
    const wrapper = await fetchBlock(blockHeightOrHash)
    const block = wrapper.attributes
    return block
  })
  const blockHash = queryBlock.data?.blockHash
  const block = queryBlock.data ?? defaultBlockInfo

  const queryBlockTransactions = useQuery(
    ['block-transactions', blockHash, currentPage, _pageSize],
    async () => {
      assert(blockHash != null)
      const { data, meta } = await fetchTransactionsByBlockHash(blockHash, currentPage, _pageSize)
      return {
        transactions: data.map(wrapper => wrapper.attributes),
        total: meta?.total ?? 0,
        pageSize: meta?.pageSize,
      }
    },
    {
      enabled: blockHash != null,
    },
  )

  const pageSize = queryBlockTransactions.data?.pageSize ?? _pageSize

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
