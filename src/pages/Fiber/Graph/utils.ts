import BigNumber from 'bignumber.js'
import { CKB_PRICE_ID, type fetchPrices } from '../../../services/UtilityService'
import { shannonToCkb } from '../../../utils/util'
import type { GraphMetrics } from './types'

const isCKBLiquidity = (price: unknown): price is { symbol: 'CKB'; amount: string } => {
  return (
    typeof price === 'object' &&
    price !== null &&
    'symbol' in price &&
    'amount' in price &&
    (price as { symbol: string }).symbol === 'CKB'
  )
}

/**
 * Gets the latest value and its difference from the previous value in a list
 * @param list - Array of objects containing string values
 * @returns Object with latest value and difference, or null if list is empty
 */
export const getLatest = (list: { value: string }[]): { value: string; diff: number } | null => {
  if (!list.length) return null
  if (list.length === 1) {
    const latest = list[0]
    return {
      value: latest.value,
      diff: +latest.value,
    }
  }
  const latest = list[list.length - 1]
  const prev = list[list.length - 2]
  return {
    value: latest.value,
    diff: +latest.value - +prev.value,
  }
}

/**
 * Calculates graph metrics from raw data
 * @param data - Object containing data array of graph history entries with totalNodes, totalChannels, totalLiquidity and timestamps
 * @returns GraphMetrics object with nodes, channels and capacity datasets and their latest values with diffs
 */
export const calculateGraphMetrics = (
  data?: {
    data: {
      totalNodes: string
      totalChannels: string
      totalCapacity: string
      createdAtUnixtimestamp: string
      totalLiquidity:
        | (
            | {
                symbol: 'CKB'
                amount: string
              }
            | {
                symbol: string
                amount: string
                decimal: string
                typeHash: string
              }
          )[]
        | null
    }[]
  },
  price?: Awaited<ReturnType<typeof fetchPrices>>,
): GraphMetrics => {
  const nodes =
    data?.data
      ?.map(item => ({
        value: item.totalNodes,
        timestamp: item.createdAtUnixtimestamp,
      }))
      .sort((a, b) => (+a.timestamp > +b.timestamp ? 1 : -1)) ?? []

  const channels =
    data?.data
      ?.map(item => ({
        value: item.totalChannels,
        timestamp: item.createdAtUnixtimestamp,
      }))
      .sort((a, b) => (+a.timestamp > +b.timestamp ? 1 : -1)) ?? []

  const capacity =
    data?.data
      ?.map(item => ({
        value: (+shannonToCkb(item.totalCapacity)).toFixed(2),
        timestamp: item.createdAtUnixtimestamp,
      }))
      .sort((a, b) => (+a.timestamp > +b.timestamp ? 1 : -1)) ?? []

  const liquidity =
    data && Array.isArray(data.data) && price
      ? data.data
          .map(item => {
            if (!item.totalLiquidity)
              return {
                value: '0',
                timestamp: item.createdAtUnixtimestamp,
              }

            let total = BigNumber(0)

            item.totalLiquidity.forEach(l => {
              if (isCKBLiquidity(l)) {
                const p = BigNumber(price.price[CKB_PRICE_ID]?.price)
                const ckbAmount = BigNumber(shannonToCkb(l.amount))
                total = total.plus(ckbAmount.multipliedBy(p))
                return
              }
              const token = price.price[l.typeHash]
              if (!token) {
                return
              }
              const p = BigNumber(token.price)
              const amount = BigNumber(l.amount).dividedBy(10 ** +l.decimal)
              total = total.plus(amount.multipliedBy(p))
            })
            return {
              value: total.toFixed(),
              timestamp: item.createdAtUnixtimestamp,
            }
          })
          .sort((a, b) => (+a.timestamp > +b.timestamp ? 1 : -1))
      : []

  return {
    nodes,
    channels,
    capacity,
    liquidity,
    latest: {
      capacity: getLatest(capacity),
      nodes: getLatest(nodes),
      channels: getLatest(channels),
      liquidity: getLatest(liquidity),
    },
  }
}
