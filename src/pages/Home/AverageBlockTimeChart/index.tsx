import React, { useEffect } from 'react'
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
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { isScreenSmallerThan1200 } from '../../../utils/screen'

const HomeChartLink = styled(Link)`
  div {
    cursor: pointer !important;
  }
`

const maxAndMinAxis = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  const array = statisticAverageBlockTimes.flatMap(data => parseFloat(data.avgBlockTimeDaily))
  return { max: Math.ceil(Math.max(...array) / 1000), min: Math.floor(Math.min(...array) / 1000) }
}

const getOption = (statisticAverageBlockTimes: State.StatisticAverageBlockTime[]) => {
  return {
    color: ['#ffffff'],
    title: {
      text: i18n.t('statistic.daily_moving_average_block_time'),
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
      left: isScreenSmallerThan1200() ? '1%' : '4%',
      right: isScreenSmallerThan1200() ? '1%' : '4%',
      top: isScreenSmallerThan1200() ? '20%' : '15%',
      bottom: isScreenSmallerThan1200() ? '18%' : '10%',
      containLabel: true,
    },
    backgroundColor: '#00000000',
    xAxis: [
      {
        name: i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 28,
        axisLine: {
          lineStyle: {
            color: '#ffffff',
            width: 1,
          },
        },
        data: statisticAverageBlockTimes.map(data => data.timestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
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

  useEffect(() => {
    getStatisticAverageBlockTimes(dispatch)
  }, [dispatch])

  if (!statisticAverageBlockTimes || statisticAverageBlockTimes.length === 0) {
    return <SmallLoading />
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
      />
    </HomeChartLink>
  )
}
