import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import echarts from 'echarts/lib/echarts'
import i18n from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { HomeChartLink, ChartLoadingPanel } from './styled'
import ChartNoDataImage from '../../../assets/chart_no_data_white.png'
import { useChartQueryWithCache, useIsLGScreen } from '../../../utils/hook'
import { explorerService } from '../../../services/ExplorerService'
import { ChartCachedKeys } from '../../../constants/cache'
import { ReactChartCore } from '../../StatisticsChart/common'

const getOption = (statisticHashRates: State.StatisticHashRate[], useMiniStyle: boolean): echarts.EChartOption => ({
  color: ['#ffffff'],
  title: {
    text: i18n.t('block.hash_rate_hps'),
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
        formatter: (value: string) => parseDateNoTime(value, true),
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
        formatter: (value: string) => handleAxis(new BigNumber(value), 0),
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
      name: i18n.t('block.hash_rate'),
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
})

export default memo(() => {
  const isLG = useIsLGScreen()

  const query = useChartQueryWithCache(explorerService.api.fetchStatisticHashRate, ChartCachedKeys.HashRate, 'date')
  const fullStatisticHashRates = useMemo(() => query.data ?? [], [query.data])

  const statisticHashRates = useMemo(() => {
    const last14Days = -15 // one day offset
    return fullStatisticHashRates.slice(last14Days)
  }, [fullStatisticHashRates])

  if (query.isLoading || statisticHashRates.length === 0) {
    return (
      <ChartLoadingPanel>
        {query.isLoading ? (
          <SmallLoading isWhite />
        ) : (
          <img className="chart__no__data" src={ChartNoDataImage} alt="chart no data" />
        )}
      </ChartLoadingPanel>
    )
  }
  return (
    <HomeChartLink to="/charts/hash-rate">
      <ReactChartCore
        option={getOption(statisticHashRates, isLG)}
        notMerge
        lazyUpdate
        style={{
          height: isLG ? '136px' : '190px',
        }}
      />
    </HomeChartLink>
  )
})
