import BigNumber from 'bignumber.js'
import { Fiber } from '../../../services/ExplorerService/fetcher'
import { formalizeChannelAsset } from '../../../utils/fiber'
import type { NodeMetrics, NodeTransaction } from './types'

interface FiberGraphNode extends Fiber.Graph.Node {
  fiberGraphChannels: (Fiber.Graph.Channel & {
    closedTransactionInfo?: {
      txHash: string
      blockNumber: number
      blockTimestamp: number
    }
    openTransactionInfo: {
      txHash: string
      blockNumber: number
      blockTimestamp: number
      address: string
      udtInfo?: {
        typeHash: string
        iconFile?: string
      }
    }
  })[]
}

/**
 * Calculates metrics for a Fiber Graph Node including:
 * - Open and closed channels
 * - Transaction history for channel operations
 * - Total liquidity across all open channels
 *
 * @param node - The Fiber Graph Node to analyze
 * @returns NodeMetrics containing channel states, transactions and liquidity info
 */
export const calculateNodeMetrics = (node: FiberGraphNode): NodeMetrics => {
  const [openChannels, closedChannels] = node.fiberGraphChannels.reduce<[Fiber.Graph.Channel[], Fiber.Graph.Channel[]]>(
    (acc: [Fiber.Graph.Channel[], Fiber.Graph.Channel[]], channel: Fiber.Graph.Channel) => {
      if (channel.closedTransactionInfo?.txHash) {
        acc[1].push(channel)
      } else {
        acc[0].push(channel)
      }
      return acc
    },
    [[], []],
  )

  const transactions = node.fiberGraphChannels.reduce<NodeTransaction[]>(
    (acc: NodeTransaction[], channel: Fiber.Graph.Channel) => {
      const assets = formalizeChannelAsset(channel)

      // Add open transaction
      acc.push({
        hash: channel.openTransactionInfo.txHash,
        isOpen: true,
        isUdt: !!channel.openTransactionInfo.udtInfo,
        block: {
          number: channel.openTransactionInfo.blockNumber,
          timestamp: channel.openTransactionInfo.blockTimestamp,
        },
        accounts: [
          {
            address: channel.openTransactionInfo.address,
            amount: `${assets.funding.amount} ${assets.funding.symbol}`,
          },
        ],
      })

      // Add close transaction if exists
      if (channel.closedTransactionInfo?.txHash) {
        acc.push({
          hash: channel.closedTransactionInfo.txHash,
          isOpen: false,
          isUdt: !!channel.openTransactionInfo.udtInfo,
          block: {
            number: channel.closedTransactionInfo.blockNumber,
            timestamp: channel.closedTransactionInfo.blockTimestamp,
          },
          accounts:
            assets.close?.map(a => ({
              address: a.addr,
              amount: `${a.amount} ${a.symbol}`,
            })) ?? [],
        })
      }

      return acc
    },
    [],
  )

  // Calculate total liquidity
  const totalLiquidity = new Map()
  openChannels.forEach((channel: Fiber.Graph.Channel) => {
    const assets = formalizeChannelAsset(channel)
    const key = channel.openTransactionInfo.udtInfo?.typeHash ?? 'ckb'

    const current = totalLiquidity.get(key) ?? {
      amount: new BigNumber(0),
      symbol: assets.funding.symbol,
      iconFile: channel.openTransactionInfo.udtInfo?.iconFile,
    }

    current.amount = current.amount.plus(new BigNumber(assets.funding.amount ?? 0))
    totalLiquidity.set(key, current)
  })

  return {
    transactions: transactions.sort((a: NodeTransaction, b: NodeTransaction) => b.block.timestamp - a.block.timestamp),
    openChannels,
    closedChannels,
    totalLiquidity,
  }
}
