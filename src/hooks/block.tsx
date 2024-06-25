import { useQueries, useQuery } from '@tanstack/react-query'
import { parseEpoch } from '@ckb-lumos/base/lib/since'
import { Block, Consensus } from '@ckb-lumos/base'
import { useCKBNode } from './useCKBNode'
import { encodeNewAddress } from '../utils/address'

function calculateBaseReward(epochString: string, consensus: Consensus) {
  const epoch = parseEpoch(epochString)
  const halvingTimes = Math.floor(epoch.number / parseInt(consensus.primaryEpochRewardHalvingInterval, 16))
  return parseInt(consensus.initialPrimaryEpochReward, 16) / (halvingTimes * 2) / epoch.length
}

function useLatestBlocks(count = 15) {
  const { nodeService, isActivated } = useCKBNode()
  const { data: tipBlockNumber } = useQuery(['node', 'tipBlockNumber'], () => nodeService.rpc.getTipBlockNumber(), {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 10 * 1000,
    refetchInterval: 12 * 1000,
    keepPreviousData: true,
    enabled: isActivated,
  })

  const blockNumbers = tipBlockNumber ? Array.from({ length: count }, (_, i) => parseInt(tipBlockNumber, 16) - i) : []

  const queries = useQueries({
    queries: blockNumbers.map(blockNumber => ({
      queryKey: ['node', 'block', blockNumber],
      queryFn: () => nodeService.rpc.getBlockByNumber(`0x${blockNumber.toString(16)}`),
    })),
  })

  return queries.map(({ data }) => data).filter(data => data) as Block[]
}

export function useNodeLatestBlocks(count = 15) {
  const { nodeService } = useCKBNode()
  const blocks = useLatestBlocks(count)
  const { data: consensus } = useQuery(['node', 'consensus'], () => nodeService.rpc.getConsensus())

  return blocks.map(block => ({
    number: parseInt(block.header.number, 16),
    timestamp: parseInt(block.header.timestamp, 16),
    liveCellChanges: block.transactions.reduce((acc, tx) => acc + (tx.outputs.length - tx.inputs.length), 1).toString(),
    reward: consensus ? calculateBaseReward(block.header.epoch, consensus).toString() : '0',
    transactionsCount: block.transactions.length,
    minerHash: encodeNewAddress(block.transactions[0].outputs[0].lock),
  }))
}

export function useNodeLatestTransactions(count = 15) {
  const blocks = useLatestBlocks(count)

  const blockTransactions = blocks.reduce(
    (acc, block) => [
      ...acc,
      ...block.transactions.map((tx, i) => ({
        transactionHash: tx.hash!,
        blockNumber: block.header.number,
        blockTimestamp: block.header.timestamp,
        capacityInvolved: tx.outputs.reduce((acc, output) => acc + parseInt(output.capacity, 16), 0).toString(),
        liveCellChanges: ((i === 0 ? 1 : 0) + tx.outputs.length - tx.inputs.length).toString(),
      })),
    ],
    [] as {
      transactionHash: string
      blockNumber: string | number
      blockTimestamp: string | number
      capacityInvolved: string
      liveCellChanges: string
    }[],
  )

  return blockTransactions.slice(0, count)
}
