import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticLiquidity } from '../../../service/app/charts/monetary'
import { handleAxis } from '../../../utils/chart'
import { shannonToCkb } from '../../../utils/util'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '4%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const Colors = [ChartColors[0], '#74808E']

const getOption = (statisticLiquidity: State.StatisticLiquidity[], isThumbnail = false): echarts.EChartOption => {
  return {
    color: Colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 125 : 70)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(Colors[1])}${widthSpan(i18n.t('statistic.circulating_supply'))} ${handleAxis(
              dataList[1].data,
              2,
            )}</div>`
            result += `<div>${tooltipColor(Colors[0])}${widthSpan(i18n.t('statistic.tradable'))} ${handleAxis(
              dataList[0].data,
              2,
            )}</div>`
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [{ name: i18n.t('statistic.tradable') }, { name: i18n.t('statistic.circulating_supply') }],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticLiquidity.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        type: 'value',
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(value),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.tradable'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          origin: 'start',
        },
        data: statisticLiquidity.map(data => shannonToCkb(data.liquidity)),
      },
      {
        name: i18n.t('statistic.circulating_supply'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          origin: 'start',
        },
        data: statisticLiquidity.map(data => shannonToCkb(data.circulatingSupply)),
      },
    ],
  }
}

export const LiquidityChart = ({
  statisticLiquidity,
  isThumbnail = false,
}: {
  statisticLiquidity: State.StatisticLiquidity[]
  isThumbnail?: boolean
}) => {
  if (!statisticLiquidity || statisticLiquidity.length === 0) {
    return <ChartLoading show={statisticLiquidity === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticLiquidity, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticLiquidity = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticLiquidity,
    payload: {
      statisticLiquidity: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticLiquidity } = useAppState()

  useEffect(() => {
    initStatisticLiquidity(dispatch)
    getStatisticLiquidity(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.liquidity')}>
      <LiquidityChart statisticLiquidity={statisticLiquidity} />
    </ChartPage>
  )
}