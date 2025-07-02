import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  statisticKnowledgeSize: ChartItem.KnowledgeSize[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
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
    top: isMobile ? '3%' : '8%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 155 : 110)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${
              (dataList[0].data as string[])[0]
            }</div>`
            result += `<div>${tooltipColor(chartColor.colors[0])}\
          ${widthSpan(t('statistic.knowledge_size'))} ${handleAxis((dataList[0].data as string[])[1], 2)}</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.knowledge_size'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'left',
        },
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: t('statistic.knowledge_size'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
      },
    ],
    dataset: {
      source: statisticKnowledgeSize.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        new BigNumber(data.knowledgeSize).toNumber(),
      ]),
    },
  }
}

const toCSV = (statisticKnowledge?: ChartItem.KnowledgeSize[]) =>
  statisticKnowledge ? statisticKnowledge.map(data => [data.createdAtUnixtimestamp, data.knowledgeSize]) : []

export const KnowledgeSizeChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.knowledge_size')}
      description={t('statistic.knowledge_size_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticKnowledgeSize}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticKnowledgeSize"
    />
  )
}

export default KnowledgeSizeChart
