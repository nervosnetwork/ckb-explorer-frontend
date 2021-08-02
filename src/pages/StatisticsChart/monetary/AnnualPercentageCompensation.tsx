import { useEffect } from 'react'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartColors } from '../../../constants/common'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
import { getStatisticAnnualPercentageCompensation } from '../../../service/app/charts/monetary'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '2%',
  right: '3%',
  top: '5%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticAnnualPercentageCompensations: State.StatisticAnnualPercentageCompensation[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: ChartColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 220 : 80)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.year'))} ${dataList[0].name}</div>`
          result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.nominal_apc'))} ${
            dataList[0].data
          }%</div>`
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.year'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
      data: statisticAnnualPercentageCompensations.map(data => data.year),
      axisLabel: {
        interval: isMobile() || isThumbnail ? 7 : 3,
        formatter: (value: string) => value,
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: i18n.t('statistic.nominal_apc'),
      type: 'value',
      nameTextStyle: {
        align: 'left',
      },
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
      name: i18n.t('statistic.nominal_apc'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      stack: 'sum',
      data: statisticAnnualPercentageCompensations.map(data => Number(data.apc).toFixed(2)),
    },
  ],
})

export const AnnualPercentageCompensationChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticAnnualPercentageCompensations, statisticAnnualPercentageCompensationsFetchEnd } = useAppState()
  if (!statisticAnnualPercentageCompensationsFetchEnd || statisticAnnualPercentageCompensations.length === 0) {
    return <ChartLoading show={!statisticAnnualPercentageCompensationsFetchEnd} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore option={getOption(statisticAnnualPercentageCompensations, isThumbnail)} isThumbnail={isThumbnail} />
  )
}

const toCSV = (statisticAnnualPercentageCompensations: State.StatisticAnnualPercentageCompensation[]) =>
  statisticAnnualPercentageCompensations
    ? statisticAnnualPercentageCompensations.map(data => [data.year, (Number(data.apc) / 100).toFixed(4)])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticAnnualPercentageCompensations } = useAppState()

  useEffect(() => {
    getStatisticAnnualPercentageCompensation(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.nominal_apc')}
      description={i18n.t('statistic.nominal_rpc_description')}
      data={toCSV(statisticAnnualPercentageCompensations)}
    >
      <AnnualPercentageCompensationChart />
    </ChartPage>
  )
}
