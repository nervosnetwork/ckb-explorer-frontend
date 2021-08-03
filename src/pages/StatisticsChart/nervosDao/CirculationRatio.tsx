import { useEffect } from 'react'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { getStatisticCirculationRatio } from '../../../service/app/charts/nervosDao'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { ChartColors } from '../../../constants/common'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '3%',
  top: '5%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticCirculationRatios: State.StatisticCirculationRatio[],
  isThumbnail = false,
): echarts.EChartOption => ({
  color: ChartColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 185 : 165)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
            dataList[0].name,
          )}</div>`
          if (dataList[0].data) {
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.circulation_ratio'))} ${
              dataList[0].data
            }%</div>`
          }
          return result
        },
      }
    : undefined,
  grid: isThumbnail ? gridThumbnail : grid,
  xAxis: [
    {
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
      nameLocation: 'middle',
      nameGap: 30,
      type: 'category',
      boundaryGap: false,
      data: statisticCirculationRatios.map(data => data.createdAtUnixtimestamp),
      axisLabel: {
        formatter: (value: string) => parseDateNoTime(value),
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('statistic.circulation_ratio'),
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
        formatter: (value: string) => `${value}%`,
      },
    },
  ],
  series: [
    {
      name: i18n.t('statistic.circulation_ratio'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticCirculationRatios.map(data => (Number(data.circulationRatio) * 100).toFixed(2)),
    },
  ],
})

export const CirculationRatioChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticCirculationRatios, statisticCirculationRatiosFetchEnd } = useAppState()
  if (!statisticCirculationRatiosFetchEnd || statisticCirculationRatios.length === 0) {
    return <ChartLoading show={!statisticCirculationRatiosFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticCirculationRatios, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticCirculationRatios: State.StatisticCirculationRatio[]) =>
  statisticCirculationRatios
    ? statisticCirculationRatios.map(data => [data.createdAtUnixtimestamp, data.circulationRatio])
    : []

export default () => {
  const dispatch = useDispatch()
  const { statisticCirculationRatios } = useAppState()

  useEffect(() => {
    getStatisticCirculationRatio(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.circulation_ratio')}
      description={i18n.t('statistic.deposit_to_circulation_ratio_description')}
      data={toCSV(statisticCirculationRatios)}
    >
      <CirculationRatioChart />
    </ChartPage>
  )
}
