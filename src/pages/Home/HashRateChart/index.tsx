import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import echarts from 'echarts/lib/echarts'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { HomeChartLink, ChartLoadingPanel } from './styled'
import ChartNoDataImage from '../../../assets/chart_no_data_white.png'
import { useIsLGScreen } from '../../../utils/hook'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ReactChartCore } from '../../StatisticsChart/common'

const useOption = () => {
  const { t } = useTranslation()
  return (statisticHashRates: ChartItem.HashRate[], useMiniStyle: boolean): echarts.EChartOption => {
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
  const isLG = useIsLGScreen()
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
    <HomeChartLink to="/charts/hash-rate">
      <ReactChartCore
        option={parseOption(statisticHashRates, isLG)}
        notMerge
        lazyUpdate
        style={{
          height: isLG ? '136px' : '190px',
        }}
      />
    </HomeChartLink>
  )
})
