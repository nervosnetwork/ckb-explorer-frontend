import React, { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { getStatisticSecondaryIssuance } from '../../../service/app/charts/monetary'

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

const Colors = ['#74808E', '#049ECD', '#69C7D4']

const getOption = (
  statisticSecondaryIssuance: State.StatisticSecondaryIssuance[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: Colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 155 : 70)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            result += `<div>${tooltipColor(Colors[2])}${widthSpan(i18n.t('nervos_dao.deposit_compensation'))} ${
              dataList[2].data
            }%</div>`
            result += `<div>${tooltipColor(Colors[1])}${widthSpan(i18n.t('nervos_dao.mining_reward'))} ${
              dataList[1].data
            }%</div>`
            result += `<div>${tooltipColor(Colors[0])}${widthSpan(i18n.t('nervos_dao.burnt'))} ${
              dataList[0].data
            }%</div>`
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [
            { name: i18n.t('nervos_dao.burnt') },
            { name: i18n.t('nervos_dao.mining_reward') },
            { name: i18n.t('nervos_dao.deposit_compensation') },
          ],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticSecondaryIssuance.map(data => data.createdAtUnixtimestamp),
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
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('nervos_dao.burnt'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticSecondaryIssuance.map(data => data.treasuryAmount),
      },
      {
        name: i18n.t('nervos_dao.mining_reward'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticSecondaryIssuance.map(data => data.miningReward),
      },
      {
        name: i18n.t('nervos_dao.deposit_compensation'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        data: statisticSecondaryIssuance.map(data => data.depositCompensation),
      },
    ],
  }
}

export const SecondaryIssuanceChart = ({
  statisticSecondaryIssuance,
  isThumbnail = false,
}: {
  statisticSecondaryIssuance: State.StatisticSecondaryIssuance[]
  isThumbnail?: boolean
}) => {
  if (!statisticSecondaryIssuance || statisticSecondaryIssuance.length === 0) {
    return <ChartLoading show={statisticSecondaryIssuance === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticSecondaryIssuance, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticSecondaryIssuance = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticSecondaryIssuance,
    payload: {
      statisticSecondaryIssuance: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticSecondaryIssuance } = useAppState()

  useEffect(() => {
    initStatisticSecondaryIssuance(dispatch)
    getStatisticSecondaryIssuance(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('nervos_dao.secondary_issuance')}>
      <SecondaryIssuanceChart statisticSecondaryIssuance={statisticSecondaryIssuance} />
    </ChartPage>
  )
}
