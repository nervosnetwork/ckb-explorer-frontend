import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticTotalSupply } from '../../../service/app/charts/monetary'
import { shannonToCkb } from '../../../utils/util'

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

const getOption = (statisticTotalSupplies: State.StatisticTotalSupply[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) =>
          `<span style="width:${currentLanguage() === 'en' ? '125px' : '55px'};display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[0])}${widthSpan(i18n.t('statistic.circulating_supply'))} ${handleAxis(
          dataList[0].data,
          2,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[1])}${widthSpan(i18n.t('statistic.burnt'))} ${handleAxis(
          dataList[1].data,
          2,
        )}</div>`
        result += `<div>${colorSpan(ChartColors[2])}${widthSpan(i18n.t('statistic.locked'))} ${handleAxis(
          dataList[2].data,
          2,
        )}</div>`
        return result
      },
    },
    legend: {
      data: [i18n.t('statistic.circulating_supply'), i18n.t('statistic.burnt'), i18n.t('statistic.locked')],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticTotalSupplies.map(data => data.createdAtUnixtimestamp),
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
        name: i18n.t('statistic.circulating_supply'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticTotalSupplies.map(data => new BigNumber(data.circulatingSupply).toFixed(0)),
      },
      {
        name: i18n.t('statistic.burnt'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticTotalSupplies.map(data => new BigNumber(shannonToCkb(data.burnt)).toFixed(0)),
      },
      {
        name: i18n.t('statistic.locked'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticTotalSupplies.map(data => new BigNumber(shannonToCkb(data.lockedCapacity)).toFixed(0)),
      },
    ],
  }
}

export const TotalSupplyChart = ({
  statisticTotalSupplies,
  isThumbnail = false,
}: {
  statisticTotalSupplies: State.StatisticTotalSupply[]
  isThumbnail?: boolean
}) => {
  if (!statisticTotalSupplies || statisticTotalSupplies.length === 0) {
    return <ChartLoading show={statisticTotalSupplies === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticTotalSupplies, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticTotalSupply = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticTotalSupply,
    payload: {
      statisticTotalSupply: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticTotalSupplies } = useAppState()

  useEffect(() => {
    initStatisticTotalSupply(dispatch)
    getStatisticTotalSupply(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.total_supply')}>
      <TotalSupplyChart statisticTotalSupplies={statisticTotalSupplies} />
    </ChartPage>
  )
}
