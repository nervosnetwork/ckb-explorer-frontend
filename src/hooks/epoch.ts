import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useStatistics, explorerService } from '../services/ExplorerService'
import { THEORETICAL_EPOCH_TIME } from '../constants/common'

export const useCurrentEpochOverTime = (theoretical: boolean) => {
  const statistics = useStatistics()
  const epochLength = Number(statistics.epochInfo.epochLength)
  const epochBlockIndex = Number(statistics.epochInfo.index)
  const tipBlockNumber = Number(statistics.tipBlockNumber)
  const firstBlockHeight = (tipBlockNumber - epochBlockIndex).toString()
  const firstBlock = useQuery(['block', firstBlockHeight], () => explorerService.api.fetchBlock(firstBlockHeight), {
    enabled: !theoretical,
  })
  const averageBlockTime = useMemo(
    () => (new Date().getTime() - (firstBlock.data?.timestamp || 0)) / epochBlockIndex,
    [firstBlock.data?.timestamp, epochBlockIndex],
  )

  if (!theoretical) {
    if (!firstBlock.data) {
      return {
        currentEpochUsedTime: 0,
        currentEpochEstimatedTime: 0,
        averageBlockTime: 0,
        isLoading: true,
      }
    }
    // Extrapolate the end time based on how much time has elapsed since the current epoch.
    const currentEpochEstimatedTime = (epochLength - epochBlockIndex) * averageBlockTime

    return {
      currentEpochUsedTime: new Date().getTime() - firstBlock.data.timestamp,
      currentEpochEstimatedTime,
      averageBlockTime,
      isLoading: statistics.epochInfo.index === '0',
    }
  }

  const currentEpochUsedTime = (epochBlockIndex / epochLength) * THEORETICAL_EPOCH_TIME
  const currentEpochEstimatedTime = THEORETICAL_EPOCH_TIME - currentEpochUsedTime
  return {
    currentEpochUsedTime,
    currentEpochEstimatedTime,
    averageBlockTime: THEORETICAL_EPOCH_TIME / epochLength,
    isLoading: statistics.epochInfo.index === '0',
  }
}

export const useEpochCountdown = (targetEpoch: number) => {
  const statistics = useStatistics()
  const currentEpoch = Number(statistics.epochInfo.epochNumber)
  const epochLength = Number(statistics.epochInfo.epochLength)
  const epochBlockIndex = Number(statistics.epochInfo.index)

  const { currentEpochEstimatedTime, currentEpochUsedTime, isLoading } = useCurrentEpochOverTime(
    !(currentEpoch === targetEpoch - 1 && epochBlockIndex / epochLength > 0.5),
  )

  const estimatedTime = currentEpochEstimatedTime + THEORETICAL_EPOCH_TIME * (targetEpoch - currentEpoch - 1)
  const estimatedDate = useMemo(() => new Date(new Date().getTime() + estimatedTime), [estimatedTime])
  const haveDone = currentEpoch >= targetEpoch

  return {
    haveDone,
    estimatedDate,
    currentEpochUsedTime,
    isLoading,
  }
}
