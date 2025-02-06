import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { explorerService } from '../../../services/ExplorerService'
import { parseNumericAbbr } from '../../../utils/chart'
import { shannonToCkb } from '../../../utils/util'
import HistoryChart from './HistoryChart'
import styles from './index.module.scss'
import MeanAndMedium from './MeanAndMedium'

const REFETCH_INTERVAL = 1000 * 60 * 5

const getLatest = (list: { value: string }[]) => {
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

const FiberGraph = () => {
  const [t] = useTranslation()

  const { data } = useQuery({
    queryKey: ['fiber_graph_history'],
    queryFn: explorerService.api.getGraphHistory,
    refetchInterval: REFETCH_INTERVAL,
  })

  const nodes =
    data?.data.map(i => ({
      value: i.totalNodes,
      timestamp: i.createdAtUnixtimestamp,
    })) ?? []

  const channels =
    data?.data.map(i => ({
      value: i.totalChannels,
      timestamp: i.createdAtUnixtimestamp,
    })) ?? []

  const capacity =
    data?.data.map(i => ({
      value: (+shannonToCkb(i.totalLiquidity)).toFixed(2),
      timestamp: i.createdAtUnixtimestamp,
    })) ?? []

  const last = data ? data.data[data.data.length - 1] : null
  const meanFeeRate = last?.meanFeeRate ?? null
  const meanLockedCapacity = last?.meanValueLocked ?? null
  const medianFeeRate = last?.mediumFeeRate ?? null
  const medianLockedCapacity = last?.mediumValueLocked ?? null

  const latestCapacity = getLatest(capacity)
  const latestNode = getLatest(nodes)
  const latestChannel = getLatest(channels)

  return (
    <div className={styles.container}>
      <div className={styles.fiberBanner}>
        <div className={styles.slogan}>
          <h1>{t(`banner.fiber_title`)}</h1>
          <h3>{t(`banner.fiber_subtitle`)}</h3>
        </div>
        <div className={styles.links}>
          <Link to="https://www.ckbfiber.net/" target="_blank" rel="noopener noreferrer">
            <span>{t(`banner.learn_more`)}</span>
          </Link>
        </div>
      </div>

      <div className={styles.history}>
        <div className={styles.vertical}>
          <div className={styles.liquidity}>
            <div className={styles.current}>
              <div>
                <span>{t('fiber.graph.total_capacity')}</span>
                {typeof latestCapacity?.diff === 'number' ? (
                  <span data-is-negative={latestCapacity.diff < 0}>{parseNumericAbbr(latestCapacity.diff)}</span>
                ) : null}
              </div>
              <div>
                {latestCapacity?.value ? <span>{`${parseNumericAbbr(latestCapacity.value, 2)} CKB`}</span> : null}
              </div>
            </div>
            <div className={styles.chart}>
              <HistoryChart dataset={capacity} color="#00cc9b" seriaName="CKB" />
            </div>
          </div>
          <div className={styles.nodes}>
            <div className={styles.current}>
              <div>
                <span>{t('fiber.graph.total_nodes')}</span>
                {typeof latestNode?.diff === 'number' ? (
                  <span data-is-negative={latestNode.diff < 0}>{parseNumericAbbr(latestNode.diff)}</span>
                ) : null}
              </div>
              {latestNode?.value ? <div>{parseNumericAbbr(latestNode.value)}</div> : null}
            </div>
            <div className={styles.chart}>
              <HistoryChart dataset={nodes} color="#FF5656" seriaName="Nodes" />
            </div>
          </div>
        </div>
        <div className={styles.channels}>
          <div className={styles.current}>
            <div>
              <span>{t('fiber.graph.total_channels')}</span>
            </div>
            <div>{latestChannel?.value}</div>
            <MeanAndMedium
              meanFeeRate={meanFeeRate}
              meanLockedCapacity={meanLockedCapacity}
              medianFeeRate={medianFeeRate}
              medianLockedCapacity={medianLockedCapacity}
            />
          </div>
          <div>
            <div className={styles.chart}>
              <HistoryChart dataset={channels} color="#F6D560" seriaName="Channels" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.geo}>
        <div>Node Distribution</div>
        <div>Map</div>
      </div>
    </div>
  )
}

export default FiberGraph
