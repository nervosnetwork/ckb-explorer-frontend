import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { explorerService } from '../../../services/ExplorerService'
import { parseNumericAbbr } from '../../../utils/chart'
import HistoryChart from './HistoryChart'
import styles from './index.module.scss'
import MeanAndMedium from './MeanAndMedium'
import GraphNodeIps from '../../../components/GraphNodeIps'
import { calculateGraphMetrics } from './utils'
import type { MetricCardProps, ChannelsCardProps } from './types'

const REFETCH_INTERVAL = 1000 * 60 * 5

const FiberGraph = () => {
  const [t] = useTranslation()

  const { data } = useQuery({
    queryKey: ['fiber_graph_history'],
    queryFn: explorerService.api.getGraphHistory,
    refetchInterval: REFETCH_INTERVAL,
  })

  const metrics = calculateGraphMetrics(data)
  const last = data?.data[data?.data.length - 1]

  const meanAndMediumProps = {
    meanFeeRate: last?.meanFeeRate ?? null,
    meanLockedCapacity: last?.meanValueLocked ?? null,
    medianFeeRate: last?.mediumFeeRate ?? null,
    medianLockedCapacity: last?.mediumValueLocked ?? null,
  }

  return (
    <div className={styles.container}>
      <FiberBanner t={t} />

      <div className={styles.history}>
        <div className={styles.vertical}>
          <MetricCard
            title={t('fiber.graph.total_capacity')}
            metric={metrics.latest.capacity}
            chart={<HistoryChart dataset={metrics.capacity} color="#00cc9b" seriaName="CKB" />}
            unit="CKB"
          />

          <MetricCard
            title={t('fiber.graph.total_nodes')}
            metric={metrics.latest.nodes}
            chart={<HistoryChart dataset={metrics.nodes} color="#FF5656" seriaName="Nodes" />}
          />
        </div>

        <ChannelsCard
          title={t('fiber.graph.total_channels')}
          channels={metrics.latest.channels}
          chart={<HistoryChart dataset={metrics.channels} color="#F6D560" seriaName="Channels" />}
          meanAndMediumProps={meanAndMediumProps}
        />
      </div>

      <div className={styles.geo}>
        <h5>{t('fiber.graph.public_fiber_node_world_map')}</h5>
        <GraphNodeIps />
      </div>
    </div>
  )
}

// Extract components
const FiberBanner = ({ t }: { t: (key: string) => string }) => (
  <div className={styles.fiberBanner}>
    <div className={styles.slogan}>
      <h1>{t('banner.fiber_title')}</h1>
      <h3>{t('banner.fiber_subtitle')}</h3>
    </div>
    <div className={styles.links}>
      <Link to="https://www.ckbfiber.net/" target="_blank" rel="noopener noreferrer">
        <span>{t('banner.learn_more')}</span>
      </Link>
    </div>
  </div>
)

const MetricCard = ({ title, metric, chart, unit = '' }: MetricCardProps) => (
  <div className={styles.liquidity}>
    <div className={styles.current}>
      <div>
        <span>{title}</span>
        {typeof metric?.diff === 'number' && (
          <span data-is-negative={metric.diff < 0}>{parseNumericAbbr(metric.diff)}</span>
        )}
      </div>
      <div>{metric?.value && <span>{`${parseNumericAbbr(metric.value, 2)} ${unit}`.trim()}</span>}</div>
    </div>
    <div className={styles.chart}>{chart}</div>
  </div>
)

const ChannelsCard = ({ title, channels, chart, meanAndMediumProps }: ChannelsCardProps) => (
  <div className={styles.channels}>
    <div className={styles.current}>
      <div>
        <span>{title}</span>
      </div>
      <div>{channels?.value}</div>
      <MeanAndMedium {...meanAndMediumProps} />
    </div>
    <div>
      <div className={styles.chart}>{chart}</div>
    </div>
  </div>
)

export default FiberGraph
