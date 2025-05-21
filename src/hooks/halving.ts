import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EPOCHS_PER_HALVING } from '../constants/common'
// TODO: This file depends on higher-level abstractions, so it should not be in the utils folder. It should be moved to `src/hooks/index.ts`.
import { useStatistics, explorerService } from '../services/ExplorerService'
import { cacheService } from '../services/CacheService'
import { useEpochCountdown } from './epoch'

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

  const { haveDone, estimatedDate, isLoading, currentEpochUsedTime } = useEpochCountdown(targetEpoch)
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
