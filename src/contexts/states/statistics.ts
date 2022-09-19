export const initStatistics: State.Statistics = {
  tipBlockNumber: '0',
  averageBlockTime: '0',
  currentEpochDifficulty: '0',
  hashRate: '0',
  epochInfo: {
    epochNumber: '0',
    epochLength: '0',
    index: '0',
  },
  estimatedEpochTime: '0',
  transactionsLast24Hrs: '0',
  transactionsCountPerMinute: '0',
  reorgStartedAt: null,
}

export default initStatistics
