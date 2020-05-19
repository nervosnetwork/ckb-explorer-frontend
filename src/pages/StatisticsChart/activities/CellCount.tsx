import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticCellCount } from '../../../service/app/charts/activities'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../utils/const'
import { ReactChartCore, ChartLoading, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

const gridThumbnail = {
  left: '4%',
  right: '4%',
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

const getOption = (statisticCellCounts: State.StatisticCellCount[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '60px' : '80px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        if (dataList[0]) {
          result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.live_cell'))} ${handleAxis(
            dataList[0].data,
            2,
          )}</div>`
        }
        if (dataList[1]) {
          result += `<div>${colorSpan(ChartColors[1])}${widthSpan(i18n.t('statistic.all_cells'))} ${handleAxis(
            dataList[1].data,
            2,
          )}</div>`
        }
        return result
      },
    },
    legend: !isThumbnail && {
      data: [i18n.t('statistic.live_cell'), i18n.t('statistic.all_cells')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticCellCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.live_cell'),
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
      {
        position: 'right',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.all_cells'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[1],
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
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticCellCounts.map(data => new BigNumber(data.liveCellsCount).toNumber()),
      },
      {
        name: i18n.t('statistic.all_cells'),
        type: 'line',
        yAxisIndex: '1',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticCellCounts.map(data => new BigNumber(data.allCellsCount).toNumber()),
      },
    ],
  }
}

export const initStatisticCellCount = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticCellCount,
    payload: {
      statisticCellCounts: undefined,
    },
  })
}

export const CellCountChart = ({
  statisticCellCounts,
  isThumbnail = false,
}: {
  statisticCellCounts: State.StatisticCellCount[]
  isThumbnail?: boolean
}) => {
  if (!statisticCellCounts || statisticCellCounts.length === 0) {
    return <ChartLoading show={statisticCellCounts === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticCellCounts, isThumbnail)} isThumbnail={isThumbnail} />
}

export default () => {
  const dispatch = useDispatch()
  const { statisticCellCounts } = useAppState()

  useEffect(() => {
    initStatisticCellCount(dispatch)
    getStatisticCellCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.cell_count')}>
      <CellCountChart statisticCellCounts={statisticCellCounts} />
    </ChartPage>
  )
}
