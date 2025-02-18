import { ReactNode } from 'react'
import type { Fiber } from '../../../services/ExplorerService'

export interface Dataset {
  timestamp: string
  value: string
}

export interface ChartProps {
  color: string
  seriaName: string
  dataset: Dataset[]
}

export interface MeanAndMediumProps {
  meanFeeRate: string | null
  medianFeeRate: string | null
  meanLockedCapacity: string | null
  medianLockedCapacity: string | null
}

export interface MetricCardProps {
  title: string
  metric: MetricDiff | null
  chart: ReactNode
  unit?: string
}

export interface ChannelsCardProps {
  title: string
  channels: MetricDiff | null
  chart: ReactNode
  meanAndMediumProps: MeanAndMediumProps
}

export interface GraphMetrics {
  nodes: Dataset[]
  channels: Dataset[]
  capacity: Dataset[]
  latest: {
    capacity: MetricDiff | null
    nodes: MetricDiff | null
    channels: MetricDiff | null
  }
}

export interface MetricDiff {
  value: string
  diff: number
}

export type GraphNode = Fiber.Graph.Node
export type GraphChannel = Fiber.Graph.Channel
