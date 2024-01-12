import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Content from '../../components/Content'
import { BlockDetailPanel } from './styled'
import { BlockOverviewCard, BlockComp } from './BlockComp'
import { usePaginationParamsInPage } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { assert } from '../../utils/error'
import { QueryResult } from '../../components/QueryResult'
import { defaultBlockInfo } from './state'
import { isTransactionHash } from '../../utils/util'

export default () => {
  const { search } = useLocation()
  const { param: blockHeightOrHash } = useParams<{ param: string }>()
  const { currentPage, pageSize: pageSizeParam, setPage } = usePaginationParamsInPage()

  const filter = new URLSearchParams(search).get('filter')

  const queryBlock = useQuery(['block', blockHeightOrHash], () => explorerService.api.fetchBlock(blockHeightOrHash))
  const blockHash = queryBlock.data?.blockHash
  const block = queryBlock.data ?? defaultBlockInfo

  const queryBlockTransactions = useQuery(
    ['block-transactions', blockHash, currentPage, pageSizeParam, filter],
    async () => {
      assert(blockHash != null)
      try {
        const {
          data: transactions,
          total,
          pageSize,
        } = await explorerService.api.fetchTransactionsByBlockHash(blockHash, {
          page: currentPage,
          size: pageSizeParam,
          filter,
        })
        return { transactions, total, pageSize }
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

  const blockHeight = !isTransactionHash(blockHeightOrHash) ? blockHeightOrHash : queryBlock.data?.number

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockOverviewCard blockHeightOrHash={blockHash ?? blockHeightOrHash} block={block} blockHeight={blockHeight} />

        <QueryResult query={queryBlockTransactions} delayLoading>
          {data => (
            <BlockComp
              onPageChange={setPage}
              currentPage={currentPage}
              pageSize={pageSize}
              total={data?.total ?? 0}
              transactions={data?.transactions ?? []}
            />
          )}
        </QueryResult>
      </BlockDetailPanel>
    </Content>
  )
}
