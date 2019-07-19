export interface StatisticsChart {
  hash_rate: {
    block_number: number
    hash_rate: string
  }[]
  difficulty: {
    block_number: number
    difficulty: number
    epoch_number: number
  }[]
}

export interface StatisticsChartWrapper {
  id: number
  type: string
  attributes: StatisticsChart
}
