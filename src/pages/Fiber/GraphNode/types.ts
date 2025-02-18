import type { BigNumber } from 'bignumber.js'
import { Fiber } from '../../../services/ExplorerService/fetcher'

export interface AssetRecord {
  symbol: string
  usd: string
}

export interface NodeTransaction {
  hash: string
  index?: string
  block: {
    number: number
    timestamp: number
  }
  isUdt: boolean
  isOpen: boolean
  accounts: {
    amount: string
    address: string
  }[]
}

export interface NodeLiquidity {
  amount: BigNumber
  symbol: string
  iconFile?: string
  usd?: BigNumber
}

export interface NodeMetrics {
  transactions: NodeTransaction[]
  openChannels: Fiber.Graph.Channel[]
  closedChannels: Fiber.Graph.Channel[]
  totalLiquidity: Map<string, NodeLiquidity>
}
