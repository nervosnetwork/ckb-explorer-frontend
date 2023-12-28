import { memo, useMemo } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import echarts from 'echarts/lib/echarts'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { parseDateNoTime } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { HomeChartLink, ChartLoadingPanel } from './styled'
import ChartNoDataImage from '../../../assets/chart_no_data_white.png'
import { useIsExtraLarge } from '../../../hooks'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ReactChartCore } from '../../StatisticsChart/common'

const useOption = () => {
  const { t } = useTranslation()
  return (statisticAverageBlockTimes: ChartItem.AverageBlockTime[], useMiniStyle: boolean): echarts.EChartOption => {
    return {
      color: ['#ffffff'],
      title: {
        text: t('statistic.average_block_time_title'),
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
      backgroundColor: '#00000000',
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            },
          },
          data: statisticAverageBlockTimes.map(data => data.timestamp),
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
          nameTextStyle: {
            align: 'left',
          },
          splitLine: {
            lineStyle: {
              color: '#ffffff',
              width: 0.5,
              opacity: 0.2,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            },
          },
          axisLabel: {
            formatter: (value: string) => localeNumberString(value),
          },
          boundaryGap: false,
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
          name: t('statistic.daily_moving_average'),
          type: 'line',
          yAxisIndex: 0,
          lineStyle: {
            color: '#ffffff',
            width: 1,
          },
          symbol: 'none',
          data: statisticAverageBlockTimes.map(data => (Number(data.avgBlockTimeDaily) / 1000).toFixed(2)),
        },
      ],
    }
  }
}

export default memo(() => {
  const isXL = useIsExtraLarge()
  const parseOption = useOption()

  const query = useQuery(
    ['fetchStatisticAverageBlockTimes'],
    () => explorerService.api.fetchStatisticAverageBlockTimes(),
    {
      refetchOnWindowFocus: false,
    },
  )
  const fullStatisticAverageBlockTimes = useMemo(() => query.data ?? [], [query.data])

  const statisticAverageBlockTimes = useMemo(() => {
    const last14Days = -336
    return fullStatisticAverageBlockTimes.slice(last14Days)
  }, [fullStatisticAverageBlockTimes])

  if (query.isLoading || statisticAverageBlockTimes.length === 0) {
    return (
      <ChartLoadingPanel>
        {query.isLoading ? (
          <SmallLoading isWhite />
        ) : (
          <img className="chartNoData" src={ChartNoDataImage} alt="chart no data" />
        )}
      </ChartLoadingPanel>
    )
  }
  return (
    <HomeChartLink to="/charts/average-block-time">
      <ReactChartCore
        option={parseOption(statisticAverageBlockTimes, isXL)}
        notMerge
        lazyUpdate
        style={{
          height: isXL ? '136px' : '190px',
        }}
      />
    </HomeChartLink>
  )
})
