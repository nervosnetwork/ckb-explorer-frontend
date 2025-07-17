import { ClientIndexerSearchKeyTransactionLike, ClientTransactionResponse } from '@ckb-ccc/core'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCKBNode } from './useCKBNode'

export const useTransactions = ({
  searchKey,
  pageSize = 100,
  order = 'desc',
}: {
  searchKey: Omit<ClientIndexerSearchKeyTransactionLike, 'groupByTransaction'>
  pageSize?: number
  order?: 'desc' | 'asc'
}) => {
  const { nodeService } = useCKBNode()

  return useInfiniteQuery({
    queryKey: ['node', 'transactions', searchKey, pageSize, order],
    queryFn: async ({ pageParam = undefined }) => {
      const { lastCursor, transactions } = await nodeService.rpc.findTransactionsPaged(
        { ...searchKey, groupByTransaction: true },
        order,
        pageSize,
        pageParam,
      )

      if (transactions.length === 0) {
        return {
          lastCursor: undefined,
          txs: [],
        }
      }

      const txHashes = transactions.map(tx => tx.txHash)
      const txs = await Promise.all(txHashes.map(txHash => nodeService.rpc.getTransaction(txHash)))

      return {
        lastCursor,
        txs: txs.filter(tx => !!tx) as ClientTransactionResponse[],
      }
    },
    getNextPageParam: options => {
      if (options.txs.length < pageSize) return undefined
      return options.lastCursor
    },
  })
}
