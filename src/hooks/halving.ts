import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { THEORETICAL_EPOCH_TIME, EPOCHS_PER_HALVING } from '../constants/common'
// TODO: This file depends on higher-level abstractions, so it should not be in the utils folder. It should be moved to `src/hooks/index.ts`.
import { useStatistics, explorerService } from '../services/ExplorerService'
import { cacheService } from '../services/CacheService'

export const useCountdown = (targetDate: Date): [number, number, number, number, number] => {
  const countdownDate = new Date(targetDate).getTime()

  const [countdown, setCountdown] = useState(countdownDate - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countdownDate])

  const expired = countdown <= 0
  const days = expired ? 0 : Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = expired ? 0 : Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = expired ? 0 : Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = expired ? 0 : Math.floor((countdown % (1000 * 60)) / 1000)

  return [days, hours, minutes, seconds, countdown]
}

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

export const useSingleHalving = (_halvingCount = 1) => {
  const halvingCount = Math.max(Math.floor(_halvingCount) || 1, 1) // halvingCount should be a positive integer greater than 1.
  const statistics = useStatistics()
  const celebrationSkipKey = `having-celebration-#${halvingCount}`
  const celebrationSkipped = cacheService.get<boolean>(celebrationSkipKey) ?? false
  function skipCelebration() {
    cacheService.set(celebrationSkipKey, true)
  }

  const currentEpoch = Number(statistics.epochInfo.epochNumber)
  const targetEpoch = EPOCHS_PER_HALVING * halvingCount
  const epochLength = Number(statistics.epochInfo.epochLength)
  const epochBlockIndex = Number(statistics.epochInfo.index)

  // special handling for last epoch: https://github.com/Magickbase/ckb-explorer-public-issues/issues/483
  const { currentEpochEstimatedTime, currentEpochUsedTime, isLoading } = useCurrentEpochOverTime(
    !(currentEpoch === targetEpoch - 1 && epochBlockIndex / epochLength > 0.5),
  )

  const estimatedTime = currentEpochEstimatedTime + THEORETICAL_EPOCH_TIME * (targetEpoch - currentEpoch - 1)
  const estimatedDate = useMemo(() => new Date(new Date().getTime() + estimatedTime), [estimatedTime])
  const haveDone = currentEpoch >= targetEpoch
  const celebrationOverEpoch = targetEpoch + 30 * 6 // Every 6 epochs is theoretically 1 day.
  const inCelebration = haveDone && currentEpoch < celebrationOverEpoch && !celebrationSkipped

  return {
    isLoading,
    halvingCount,
    currentEpoch,
    targetEpoch,
    inCelebration,
    skipCelebration,
    currentEpochUsedTime,
    estimatedDate,
  }
}

export const useEpochBlockMap = () => {
  const statistics = useStatistics()
  const currentEpoch = Number(statistics.epochInfo.epochNumber)
  const { data: epochStatistic } = useQuery(['fetchStatisticDifficultyUncleRateEpoch', currentEpoch], () =>
    explorerService.api.fetchStatisticDifficultyUncleRateEpoch(),
  )

  const epochBlockMap = useMemo(() => {
    const r = new Map<number, number>([[0, 0]])
    epochStatistic?.forEach(i => {
      const last = r.get(+i.epochNumber) ?? 0
      r.set(+i.epochNumber + 1, +i.epochLength + last)
    })

    return r
  }, [epochStatistic])

  return {
    epochBlockMap,
  }
}

export const useHalving = () => {
  const statistics = useStatistics()
  const currentEpoch = Number(statistics.epochInfo.epochNumber)
  const nextHalvingCount = Math.ceil((currentEpoch + 1) / EPOCHS_PER_HALVING)
  const nextHalving = useSingleHalving(nextHalvingCount)
  const previousHalving = useSingleHalving(nextHalvingCount - 1)

  return previousHalving.inCelebration ? previousHalving : nextHalving
}
