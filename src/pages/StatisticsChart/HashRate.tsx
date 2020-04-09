import React, { useEffect } from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticHashRate } from '../../service/app/statisticsChart'
import i18n from '../../utils/i18n'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel } from './styled'
import { parseDateNoTime } from '../../utils/date'
import { isMobile } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers'
import { handleHashRate } from '../../utils/number'
import { ChartColors } from '../../utils/const'
import { ChartLoading, ReactChartCore } from './ChartComponents'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticHashRates: State.StatisticHashRate[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:80px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
          dataList[0].data,
        )}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticHashRates.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('block.hash_rate'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('block.hash_rate'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticHashRates.map(data => new BigNumber(data.avgHashRate).toNumber()),
      },
    ],
  }
}

export const HashRateChart = ({
  statisticHashRates,
  isThumbnail = false,
}: {
  statisticHashRates: State.StatisticHashRate[]
  isThumbnail?: boolean
}) => {
  if (!statisticHashRates || statisticHashRates.length === 0) {
    return <ChartLoading show={statisticHashRates === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticHashRates, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticHashRate = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticHashRate,
    payload: {
      statisticHashRates: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticHashRates = [] } = useAppState()

  useEffect(() => {
    initStatisticHashRate(dispatch)
    getStatisticHashRate(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{i18n.t('block.hash_rate')}</ChartTitle>
      <ChartPanel>
        <HashRateChart statisticHashRates={statisticHashRates} />
      </ChartPanel>
    </Content>
  )
}
