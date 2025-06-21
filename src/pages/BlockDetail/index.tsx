/* eslint-disable unused-imports/no-unused-imports */
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Block as NodeBlock } from '@ckb-lumos/base'
import { parseEpoch } from '@ckb-lumos/base/lib/since'
import Content from '../../components/Content'
import { NodeBlockTransactionList } from './NodeBlockTransactionList'
import { BlockOverviewCard, BlockOverviewCardProps, BlockComp } from './BlockComp'
import { usePaginationParamsInPage } from '../../hooks'
import { useCKBNode } from '../../hooks/useCKBNode'
import { explorerService } from '../../services/ExplorerService'
import { assert } from '../../utils/error'
import { QueryResult } from '../../components/QueryResult'
import { defaultBlockInfo } from './state'
import { Block } from '../../models/Block'
import { isBlockNumber, compactToDifficulty } from '../../utils/number'
import { encodeNewAddress } from '../../utils/address'
import styles from './styles.module.scss'

function transformNodeBlock(block: NodeBlock): BlockOverviewCardProps['block'] {
  const epoch = parseEpoch(block.header.epoch)

  return {
    blockHash: block.header.hash,
    number: parseInt(block.header.number, 16),
    minerHash: encodeNewAddress(block.transactions[0].outputs[0].lock),
    transactionsRoot: block.header.transactionsRoot,
    transactionsCount: block.transactions.length,
    proposalsCount: block.proposals.length,
    unclesCount: block.uncles.length,
    difficulty: compactToDifficulty(parseInt(block.header.compactTarget, 16)),
    timestamp: block.header.timestamp,
    nonce: block.header.nonce,
    epochLength: epoch.length,
    epochIndex: epoch.index,
    epochNumber: epoch.number,
  }
}

function transformBlock(block: Block): BlockOverviewCardProps['block'] {
  return {
    ...block,
    epochIndex: parseInt(block.blockIndexInEpoch, 10),
    epochLength: parseInt(block.length, 10),
    epochNumber: block.epoch,
    timestamp: block.timestamp.toString(),
    cycles: block.cycles ?? undefined,
    maxCycles: block.maxCycles ?? undefined,
    maxCyclesInEpoch: block.maxCyclesInEpoch ?? undefined,
  }
}

export default () => {
  const { isActivated: nodeModeActivated } = useCKBNode()
  const { search } = useLocation()
  const { param: blockHeightOrHash } = useParams<{ param: string }>()
  const { currentPage, pageSize: pageSizeParam, setPage } = usePaginationParamsInPage()
  const filter = new URLSearchParams(search).get('filter')
  const { nodeService } = useCKBNode()

  const nodeBlockQuery = useQuery(
    ['node', 'block', 'info', blockHeightOrHash],
    () =>
      isBlockNumber(blockHeightOrHash)
        ? nodeService.rpc.getBlockByNumber(`0x${Number(blockHeightOrHash).toString(16)}`)
        : nodeService.rpc.getBlock(blockHeightOrHash),
    {
      enabled: nodeModeActivated,
    },
  )

  const blockQuery = useQuery(['block', blockHeightOrHash], () => explorerService.api.fetchBlock(blockHeightOrHash), {
    enabled: !nodeModeActivated,
  })

  const nodeBlock = nodeBlockQuery.data ? transformNodeBlock(nodeBlockQuery.data) : transformBlock(defaultBlockInfo)
  const block = nodeModeActivated ? nodeBlock : transformBlock(blockQuery.data ?? defaultBlockInfo)
  const { blockHash } = block
  const queryBlockTransactions = useQuery(
    ['block-transactions', blockHash, currentPage, pageSizeParam, filter],
    async () => {
      assert(!!blockHash)
      try {
        const { transactions, total, pageSize } = await explorerService.api.fetchTransactionsByBlockHash(blockHash, {
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
      enabled: blockHash != null && !nodeModeActivated,
    },
  )

  const pageSize = queryBlockTransactions.data?.pageSize ?? pageSizeParam

  return (
    <Content>
      <div className={`${styles.blockDetailPanel} container`}>
        <BlockOverviewCard block={block} />

        {nodeModeActivated ? (
          <NodeBlockTransactionList transactions={nodeBlockQuery.data?.transactions ?? []} blockNumber={block.number} />
        ) : (
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
        )}
      </div>
    </Content>
  )
}
