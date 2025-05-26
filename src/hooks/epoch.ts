import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useStatistics, explorerService } from '../services/ExplorerService'
import { THEORETICAL_EPOCH_TIME } from '../constants/common'

const useCurrentEpochOverTime = () => {
  const statistics = useStatistics()
  const epochLength = Number(statistics.epochInfo.epochLength)
  const epochBlockIndex = Number(statistics.epochInfo.index)
  const epochTimeLength = Number(statistics.estimatedEpochTime)
  const avgBlockTime = Number(statistics.averageBlockTime)

  const firstBlock = useQuery({
    queryKey: ['blockByEpoch', statistics.epochInfo.epochNumber],
    queryFn: () => explorerService.api.fetchBlockByEpoch(+statistics.epochInfo.epochNumber),
  })

  const averageBlockTime = useMemo(
    () => (new Date().getTime() - (firstBlock.data?.timestamp || 0)) / epochBlockIndex,
    [firstBlock.data?.timestamp, epochBlockIndex],
  )

  const currentEpochUsedTime = firstBlock?.data
    ? new Date().getTime() - firstBlock.data.timestamp
    : (epochBlockIndex / epochLength) * epochTimeLength

  const currentEpochRemainingTime = (epochLength - epochBlockIndex) * averageBlockTime

  return {
    currentEpochUsedTime,
    currentEpochRemainingTime,
    avgBlockTime,
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

  const { currentEpochRemainingTime, currentEpochUsedTime, isLoading, avgBlockTime } = useCurrentEpochOverTime()

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
      remainingTime += avgBlockTime
    }
    return new Date(Date.now() + remainingTime)
  }, [haveDone, targetEpoch, currentEpoch, currentEpochRemainingTime, avgBlockTime])

  return {
    currentEpoch,
    haveDone,
    estimatedDate: !haveDone && estimatedDate < new Date() ? new Date(Date.now() + 3000) : estimatedDate, // avoid negative date
    currentEpochUsedTime,
    isLoading,
  }
}
