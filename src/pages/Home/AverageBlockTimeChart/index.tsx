import React, { useEffect, useCallback, useRef } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { getStatisticAverageBlockTimes } from '../../../service/app/charts/block'
import { localeNumberString } from '../../../utils/number'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { isScreenSmallerThan1200 } from '../../../utils/screen'
import { HomeChartLink, ChartLoadingPanel } from './styled'

const maxAndMinAxis = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  const array = statisticAverageBlockTimes.flatMap(data => parseFloat(data.avgBlockTimeDaily))
  return { max: Math.ceil(Math.max(...array) / 1000), min: Math.floor(Math.min(...array) / 1000) }
}

const getOption = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  return {
    color: ['#ffffff'],
    title: {
      text: i18n.t('statistic.average_block_time_title'),
      textAlign: 'left',
      itemGap: 15,
      textStyle: {
        color: '#ffffff',
        fontSize: 12,
        fontWight: 'lighter',
        fontFamily: 'Lato',
      },
    },
    grid: {
      left: isScreenSmallerThan1200() ? '1%' : '2%',
      right: '3%',
      top: isScreenSmallerThan1200() ? '20%' : '15%',
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
          },
        },
        interval: 1,
        max: maxAndMinAxis(statisticAverageBlockTimes).max,
        min: maxAndMinAxis(statisticAverageBlockTimes).min,
        axisLine: {
          lineStyle: {
            color: '#ffffff',
            width: 1,
          },
        },
        axisLabel: {
          formatter: (value: string) => localeNumberString(value),
        },
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
        name: i18n.t('statistic.daily_moving_average'),
        type: 'line',
        yAxisIndex: '0',
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

export default () => {
  const dispatch = useDispatch()
  const { statisticAverageBlockTimes } = useAppState()
  const screenWidth = useRef<number>(window.innerWidth)
  const widthDiff = window.innerWidth > 750 && Math.abs(screenWidth.current - window.innerWidth)

  const clickEvent = useCallback(() => {
    if (widthDiff) {
      screenWidth.current = window.innerWidth
    }
  }, [widthDiff])

  useEffect(() => {
    getStatisticAverageBlockTimes(dispatch)
  }, [dispatch])

  if (!statisticAverageBlockTimes || statisticAverageBlockTimes.length === 0) {
    return (
      <ChartLoadingPanel>
        <SmallLoading isWhite />
      </ChartLoadingPanel>
    )
  }
  return (
    <HomeChartLink to="/charts/average-block-time">
      <ReactEchartsCore
        echarts={echarts}
        option={getOption(statisticAverageBlockTimes)}
        notMerge
        lazyUpdate
        style={{
          height: isScreenSmallerThan1200() ? '136px' : '190px',
        }}
        onEvents={{ click: clickEvent }}
      />
    </HomeChartLink>
  )
}
