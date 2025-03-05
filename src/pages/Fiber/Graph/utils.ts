import { shannonToCkb } from '../../../utils/util'
import type { GraphMetrics } from './types'

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
export const calculateGraphMetrics = (data?: {
  data: { totalNodes: string; totalChannels: string; totalLiquidity: string; createdAtUnixtimestamp: string }[]
}): GraphMetrics => {
  const nodes =
    data?.data?.map(item => ({
      value: item.totalNodes,
      timestamp: item.createdAtUnixtimestamp,
    })) ?? []

  const channels =
    data?.data?.map(item => ({
      value: item.totalChannels,
      timestamp: item.createdAtUnixtimestamp,
    })) ?? []

  const capacity =
    data?.data?.map(item => ({
      value: (+shannonToCkb(item.totalLiquidity)).toFixed(2),
      timestamp: item.createdAtUnixtimestamp,
    })) ?? []

  return {
    nodes,
    channels,
    capacity,
    latest: {
      capacity: getLatest(capacity),
      nodes: getLatest(nodes),
      channels: getLatest(channels),
    },
  }
}
