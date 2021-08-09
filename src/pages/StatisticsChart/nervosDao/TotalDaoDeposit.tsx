import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticTotalDaoDeposit } from '../../../service/app/charts/nervosDao'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { ChartNotePanel } from '../common/styled'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { ChartColors } from '../../../constants/common'
import { isMainnet } from '../../../utils/chain'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '4%',
  right: '3%',
  top: '6%',
  bottom: '5%',
  containLabel: true,
}

const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 110 : 110)

const parseTooltip = ({ seriesName, data }: { seriesName: string; data: string }): string => {
  if (seriesName === i18n.t('statistic.total_dao_deposit')) {
    return `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.total_dao_deposit'))} ${handleAxis(
      data,
      2,
    )}</div>`
  }
  if (seriesName === i18n.t('statistic.total_dao_depositor')) {
    return `<div>${tooltipColor(ChartColors[1])}${widthSpan(i18n.t('statistic.total_dao_depositor'))} ${handleAxis(
      data,
      2,
      true,
    )}</div>`
  }
  return ''
}

const getOption = (
  statisticTotalDaoDeposits: State.StatisticTotalDaoDeposit[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: ChartColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const list = dataList as Array<{ seriesName: string; data: string; name: string }>
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
            list[0].name,
          )}</div>`
          list.forEach(data => {
            result += parseTooltip(data)
          })
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  legend: {
    data: isThumbnail
      ? []
      : [
          {
            name: i18n.t('statistic.total_dao_deposit'),
          },
          {
            name: i18n.t('statistic.total_dao_depositor'),
          },
        ],
  },
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
      data: statisticTotalDaoDeposits.map(data => data.createdAtUnixtimestamp),
      axisLabel: {
        formatter: (value: string) => parseDateNoTime(value),
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.total_dao_deposit'),
      nameTextStyle: {
        align: 'left',
      },
      type: 'value',
      scale: true,
      axisLine: {
        lineStyle: {
          color: ChartColors[0],
        },
      },
      axisLabel: {
        formatter: (value: string) => `${handleAxis(value)}B`,
      },
    },
    {
      position: 'right',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.total_dao_depositor'),
      nameTextStyle: {
        align: 'right',
      },
      type: 'value',
      scale: true,
      axisLine: {
        lineStyle: {
          color: ChartColors[1],
        },
      },
      axisLabel: {
        formatter: (value: string) => `${handleAxis(new BigNumber(value))}`,
      },
    },
  ],
  series: [
    {
      name: i18n.t('statistic.total_dao_deposit'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticTotalDaoDeposits.map(data => new BigNumber(shannonToCkb(data.totalDaoDeposit)).toFixed(0)),
    },
    {
      name: i18n.t('statistic.total_dao_depositor'),
      type: 'line',
      yAxisIndex: 1,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticTotalDaoDeposits.map(data => new BigNumber(data.totalDepositorsCount).toNumber()),
    },
  ],
})

export const TotalDaoDepositChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticTotalDaoDeposits, statisticTotalDaoDepositsFetchEnd } = useAppState()
  if (!statisticTotalDaoDepositsFetchEnd || statisticTotalDaoDeposits.length === 0) {
    return <ChartLoading show={!statisticTotalDaoDepositsFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticTotalDaoDeposits, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticTotalDaoDeposits: State.StatisticTotalDaoDeposit[]) =>
  statisticTotalDaoDeposits
    ? statisticTotalDaoDeposits.map(data => [
        data.createdAtUnixtimestamp,
        shannonToCkbDecimal(data.totalDaoDeposit, 8),
        data.totalDepositorsCount,
      ])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticTotalDaoDeposits } = useAppState()

  useEffect(() => {
    getStatisticTotalDaoDeposit(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.total_dao_deposit_depositor')}
      description={i18n.t('statistic.total_dao_deposit_description')}
      data={toCSV(statisticTotalDaoDeposits)}
    >
      <TotalDaoDepositChart />
      {isMainnet() && <ChartNotePanel>{`${i18n.t('common.note')}1GB = 1,000,000,000 CKBytes`}</ChartNotePanel>}
    </ChartPage>
  )
}
