import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts/core'
import { GridComponent, TitleComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { handleAxis } from '../../../utils/chart'
import SmallLoading from '../../../components/Loading/SmallLoading'
import ChartNoDataImage from '../../../assets/chart_no_data_white.png'
import { useIsExtraLarge } from '../../../hooks'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ReactChartCore } from '../../StatisticsChart/common'
import styles from './index.module.scss'
import { Link } from '../../../components/Link'

echarts.use([GridComponent, TitleComponent, LineChart, CanvasRenderer, UniversalTransition])

const useOption = () => {
  const { t } = useTranslation()
  return (statisticHashRates: ChartItem.HashRate[], useMiniStyle: boolean): EChartsOption => {
    return {
      color: ['#ffffff'],
      title: {
        text: t('block.hash_rate_hps'),
        textAlign: 'left',
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'lighter',
          fontFamily: 'Lato',
        },
      },
      grid: {
        left: useMiniStyle ? '1%' : '2%',
        right: '3%',
        top: useMiniStyle ? '20%' : '15%',
        bottom: '2%',
        containLabel: true,
      },
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            },
          },
          data: statisticHashRates.map(data => data.createdAtUnixtimestamp),
          axisLabel: {
            formatter: (value: string) => dayjs(+value * 1000).format('MM/DD'),
          },
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          position: 'left',
          type: 'value',
          scale: true,
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            },
          },
          splitLine: {
            lineStyle: {
              color: '#ffffff',
              width: 0.5,
              opacity: 0.2,
            },
          },
          axisLabel: {
            formatter: (value: number) => handleAxis(new BigNumber(value), 0),
          },
          boundaryGap: ['5%', '2%'],
        },
        {
          position: 'right',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            },
          },
        },
      ],
      series: [
        {
          name: t('block.hash_rate'),
          type: 'line',
          yAxisIndex: 0,
          lineStyle: {
            color: '#ffffff',
            width: 1,
          },
          symbol: 'none',
          data: statisticHashRates.map(data => new BigNumber(data.avgHashRate).toNumber()),
        },
      ],
    }
  }
}
export default memo(() => {
  const isXL = useIsExtraLarge()
  const query = useQuery(['fetchStatisticHashRate'], () => explorerService.api.fetchStatisticHashRate(), {
    refetchOnWindowFocus: false,
  })
  const fullStatisticHashRates = useMemo(() => query.data ?? [], [query.data])
  const parseOption = useOption()

  const statisticHashRates = useMemo(() => {
    const last14Days = -15 // one day offset
    return fullStatisticHashRates.slice(last14Days)
  }, [fullStatisticHashRates])

  if (query.isLoading || statisticHashRates.length === 0) {
    return (
      <div className={styles.chartLoadingPanel}>
        {query.isLoading ? (
          <SmallLoading isWhite />
        ) : (
          <img className="chartNoData" src={ChartNoDataImage} alt="chart no data" />
        )}
      </div>
    )
  }

  return (
    <Link to="/charts/hash-rate" className={styles.homeChartLink}>
      <ReactChartCore
        option={parseOption(statisticHashRates, isXL)}
        notMerge
        lazyUpdate
        style={{
          height: isXL ? '136px' : '190px',
        }}
      />
    </Link>
  )
})
