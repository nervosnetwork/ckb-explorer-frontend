import React, { useEffect, useContext } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { getStatisticCellCount } from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel, LoadingPanel } from './styled'

const colors = ['#3182bd', '#66CC99']

const gridThumbnail = {
  left: '4%',
  right: '4%',
  top: '8%',
  bottom: '12%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true,
}

const getOption = (statisticCellCounts: State.StatisticCellCount[], isThumbnail = false) => {
  return {
    color: colors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:100px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('block.block_number'))} ${handleAxis(
          dataList[0].name,
          1,
        )}</div>`
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('statistic.live_cell'))} ${handleAxis(
          dataList[0].data,
          2,
        )}</div>`
        result += `<div>${colorSpan(colors[1])}${widthSpan(i18n.t('statistic.dead_cell'))} ${handleAxis(
          dataList[1].data,
          2,
        )}</div>`
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('statistic.live_cell'), i18n.t('statistic.dead_cell')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: statisticCellCounts.map(data => data.blockNumber),
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: false,
        axisLine: {
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.live_cell'),
        type: 'line',
        areaStyle: {
          normal: {
            origin: 'auto',
          },
        },
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticCellCounts.map(data => new BigNumber(data.liveCellCount).toNumber()),
      },
      {
        name: i18n.t('statistic.dead_cell'),
        type: 'line',
        areaStyle: {
          normal: {
            origin: 'auto',
          },
        },
        symbol: 'circle',
        symbolSize: 3,
        data: statisticCellCounts.map(data => new BigNumber(data.deadCellCount).toNumber()),
      },
    ],
  }
}

export const CellCountChart = ({
  statisticCellCounts,
  isThumbnail = false,
}: {
  statisticCellCounts: State.StatisticCellCount[]
  isThumbnail?: boolean
}) => {
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption(statisticCellCounts, isThumbnail)}
      notMerge
      lazyUpdate
      style={{
        height: isThumbnail ? '30vh' : '70vh',
      }}
    />
  )
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticCellCounts } = useContext(AppContext)

  useEffect(() => {
    getStatisticCellCount(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{`${i18n.t('statistic.live_cell')} & ${i18n.t('statistic.dead_cell')}`}</ChartTitle>
      {statisticCellCounts.length > 0 ? (
        <ChartPanel>
          <CellCountChart statisticCellCounts={statisticCellCounts} />
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <Loading show />
        </LoadingPanel>
      )}
    </Content>
  )
}
