import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticDifficulty } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { handleDifficulty } from '../../../utils/number'
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

const getOption = (statisticDifficulties: State.StatisticDifficulty[], isThumbnail = false): echarts.EChartOption => ({
  color: ChartColors,
  tooltip: !isThumbnail
    ? {
        trigger: 'axis',
        formatter: (dataList: any) => {
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 70 : 35)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
            dataList[0].name,
          )}</div>`
          result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('block.difficulty'))} ${handleDifficulty(
            dataList[0].data,
          )}</div>`
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
      data: statisticDifficulties.map(data => data.createdAtUnixtimestamp),
      axisLabel: {
        formatter: (value: string) => parseDateNoTime(value),
      },
    },
  ],
  yAxis: [
    {
      position: 'left',
      name: isMobile() || isThumbnail ? '' : i18n.t('block.difficulty'),
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
      name: i18n.t('block.difficulty'),
      type: 'line',
      yAxisIndex: 0,
      symbol: isThumbnail ? 'none' : 'circle',
      symbolSize: 3,
      data: statisticDifficulties.map(data => new BigNumber(data.avgDifficulty).toNumber()),
    },
  ],
})

export const DifficultyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { statisticDifficulties, statisticDifficultiesFetchEnd } = useAppState()
  if (!statisticDifficultiesFetchEnd || statisticDifficulties.length === 0) {
    return <ChartLoading show={!statisticDifficultiesFetchEnd} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticDifficulties, isThumbnail)} isThumbnail={isThumbnail} />
}

const toCSV = (statisticDifficulties: State.StatisticDifficulty[]) =>
  statisticDifficulties ? statisticDifficulties.map(data => [data.createdAtUnixtimestamp, data.avgDifficulty]) : []

export default () => {
  const dispatch = useDispatch()
  const { statisticDifficulties } = useAppState()

  useEffect(() => {
    getStatisticDifficulty(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('block.difficulty')} data={toCSV(statisticDifficulties)}>
      <DifficultyChart />
    </ChartPage>
  )
}
