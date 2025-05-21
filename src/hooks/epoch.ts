import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useStatistics, explorerService } from '../services/ExplorerService'
import { THEORETICAL_EPOCH_TIME } from '../constants/common'

const useCurrentEpochOverTime = (theoretical: boolean) => {
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
        currentEpochRemainingTime: 0,
        averageBlockTime: 0,
        isLoading: true,
      }
    }
    // Extrapolate the end time based on how much time has elapsed since the current epoch.
    const currentEpochRemainingTime = (epochLength - epochBlockIndex) * averageBlockTime

    return {
      currentEpochUsedTime: new Date().getTime() - firstBlock.data.timestamp,
      currentEpochRemainingTime,
      averageBlockTime,
      isLoading: statistics.epochInfo.index === '0',
    }
  }

  const currentEpochUsedTime = (epochBlockIndex / epochLength) * THEORETICAL_EPOCH_TIME
  const currentEpochRemainingTime = THEORETICAL_EPOCH_TIME - currentEpochUsedTime
  return {
    currentEpochUsedTime,
    currentEpochRemainingTime,
    averageBlockTime: THEORETICAL_EPOCH_TIME / epochLength,
    isLoading: statistics.epochInfo.index === '0',
  }
}

export const useEpochCountdown = (targetEpoch: number) => {
  const statistics = useStatistics()

  const currentEpoch = +statistics.epochInfo.epochLength
    ? +statistics.epochInfo.epochNumber + +statistics.epochInfo.index / +statistics.epochInfo.epochLength
    : +statistics.epochInfo.epochNumber

  const remainingEpoch = Math.max(targetEpoch - currentEpoch, 0)
  const haveDone = remainingEpoch <= 0

  const { currentEpochRemainingTime, currentEpochUsedTime, isLoading } = useCurrentEpochOverTime(remainingEpoch <= 0.25) // use dynamic block time within 1/4 epoch left

  const estimatedDate = useMemo(() => {
    if (haveDone) {
      return new Date()
    }
    let remainingTime = 0
    const targetEpochNumber = Math.floor(targetEpoch)
    const currentEpochNumber = Math.floor(currentEpoch)

    if (currentEpochNumber === targetEpochNumber) {
      // if the target epoch and current epoch are in the same cycle
      remainingTime =
        (currentEpochRemainingTime * (targetEpoch - currentEpoch)) / (currentEpoch + 1 - currentEpochNumber)
    } else {
      // if the target epoch is in the following cycles
      remainingTime = currentEpochRemainingTime + (targetEpoch - currentEpochNumber - 1) * THEORETICAL_EPOCH_TIME
    }

    // add a tolerance when it comes to the end (1min)
    if (remainingTime < 60 * 1000) {
      remainingTime += 20 * 1000
    }
    return new Date(Date.now() + remainingTime)
  }, [haveDone, targetEpoch, currentEpoch])

  return {
    currentEpoch,
    haveDone,
    estimatedDate: !haveDone && estimatedDate < new Date() ? new Date(Date.now() + 3000) : estimatedDate, // avoid negative date
    currentEpochUsedTime,
    isLoading,
  }
}
