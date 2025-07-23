import { useQueries, useQuery } from '@tanstack/react-query'
import { ClientBlock } from '@ckb-ccc/core'
import { useCKBNode } from './useCKBNode'
import { encodeNewAddress } from '../utils/address'

function calculateBaseReward(epochIndex: number, epochNumber: number, consensus: CKBComponents.Consensus) {
  const halvingTimes = Math.floor(epochNumber / parseInt(consensus.primaryEpochRewardHalvingInterval, 16))
  return parseInt(consensus.initialPrimaryEpochReward, 16) / halvingTimes ** 2 / epochIndex
}

function useLatestBlocks(count = 15): ClientBlock[] {
  const { nodeService, isActivated } = useCKBNode()
  const { data: tipBlockNumber } = useQuery(['node', 'tipBlockNumber'], () => nodeService.rpc.getTip(), {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 10 * 1000,
    refetchInterval: 12 * 1000,
    keepPreviousData: true,
    enabled: isActivated,
  })

  const blockNumbers = tipBlockNumber
    ? Array.from({ length: count }, (_, i) => parseInt(tipBlockNumber.toString(), 10) - i)
    : []

  const queries = useQueries({
    queries: blockNumbers.map(blockNumber => ({
      queryKey: ['node', 'block', blockNumber],
      queryFn: () => nodeService.rpc.getBlockByNumber(`0x${blockNumber.toString(16)}`),
    })),
  })

  return queries.map(({ data }) => data).filter(b => !!b) as ClientBlock[]
}

export function useNodeLatestBlocks(count = 15) {
  const { nodeService } = useCKBNode()
  const blocks = useLatestBlocks(count)
  const { data: consensus } = useQuery(['node', 'consensus'], () => nodeService.getConsensus())

  return blocks.map(block => ({
    number: parseInt(block.header.number.toString(), 10),
    timestamp: parseInt(block.header.timestamp.toString(), 10),
    liveCellChanges: block.transactions.reduce((acc, tx) => acc + (tx.outputs.length - tx.inputs.length), 1).toString(),
    reward: consensus
      ? calculateBaseReward(
          Number(block.header.epoch[0].toString()),
          Number(block.header.epoch[2].toString()),
          consensus,
        ).toString()
      : '0',
    transactionsCount: block.transactions.length,
    minerHash: encodeNewAddress(block.transactions[0].outputs[0].lock),
  }))
}

export function useNodeLatestTransactions(count = 15) {
  const blocks = useLatestBlocks(count)

  const blockTransactions = blocks.flatMap(block =>
    block.transactions.map((tx, i) => ({
      transactionHash: tx.hash(),
      blockNumber: block.header.number.toString(),
      blockTimestamp: block.header.timestamp.toString(),
      capacityInvolved: tx.getOutputsCapacity().toString(),
      liveCellChanges: ((i === 0 ? 1 : 0) + tx.outputs.length - tx.inputs.length).toString(),
    })),
  )

  return blockTransactions.slice(0, count)
}
