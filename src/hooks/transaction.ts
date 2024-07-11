import { RPC } from '@ckb-lumos/rpc'
import { Hash, Transaction } from '@ckb-lumos/base'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCKBNode } from './useCKBNode'

export const useTransactions = ({
  searchKey,
  pageSize = 100,
  order = 'desc',
}: {
  searchKey: Parameters<RPC['getTransactions']>['0']
  pageSize?: number
  order?: 'desc' | 'asc'
}) => {
  const { nodeService } = useCKBNode()

  return useInfiniteQuery({
    queryKey: ['node', 'transactions', searchKey, pageSize, order],
    queryFn: async ({ pageParam = undefined }) => {
      const { lastCursor, objects } = await nodeService.rpc.getTransactions(
        { ...searchKey, groupByTransaction: true },
        order,
        `0x${pageSize.toString(16)}`,
        pageParam,
      )

      if (objects.length === 0) {
        return {
          lastCursor: undefined,
          txs: [],
        }
      }

      const txHashes = objects.map(tx => tx.txHash)

      const txs = await nodeService.rpc
        .createBatchRequest<'getTransaction', [Hash], CKBComponents.TransactionWithStatus[]>(
          txHashes.map(txHash => ['getTransaction', txHash]),
        )
        .exec()

      return {
        lastCursor,
        txs: txs.map(tx => ({
          transaction: tx.transaction as Transaction,
          txStatus: tx.txStatus,
        })),
      }
    },
    getNextPageParam: options => {
      if (options.txs.length < pageSize) return undefined
      return options.lastCursor
    },
  })
}
