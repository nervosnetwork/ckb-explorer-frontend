import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { parseSimpleDate, parseSimpleDateNoSecond } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { localeNumberString } from '../../../utils/number'
import { DATA_ZOOM_CONFIG, assertIsArray, assertSerialsItem, handleAxis } from '../../../utils/chart'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const useOption = (
  data: ChartItem.AssetActivity[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const gridThumbnail = {
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '2%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 180 : 100)

  const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data?: string[] }): string => {
    if (seriesName === t('statistic.udt_holders') && data?.[1]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.udt_holders'))} ${localeNumberString(data[1])}</div>`
    }
    if (seriesName === t('statistic.udt_txs') && data?.[2]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.udt_txs'))} ${localeNumberString(data[2])}</div>`
    }
    return ''
  }

  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${parseSimpleDateNoSecond(
              new Date(dataList[0].data[0]),
              '/',
              false,
            )}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              result += parseTooltip({ ...data })
            })
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          icon: 'roundRect',
          data: [
            {
              name: t('statistic.udt_holders'),
            },
            {
              name: t('statistic.udt_txs'),
            },
          ],
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    /* Selection starts from 1% because the average block time is extremely high on launch */
    dataZoom: DATA_ZOOM_CONFIG.map(zoom => ({ ...zoom, show: !isThumbnail, start: 1 })),
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category', // TODO: use type: time
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('YYYY/MM/DD'),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.udt_holders'),
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
          formatter: (value: string) => handleAxis(value),
        },
      },
      {
        position: 'right',
        splitLine: { show: false },
        name: isMobile || isThumbnail ? '' : t('statistic.udt_txs'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'right',
        },
        axisLine: {
          lineStyle: {
            color: chartColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(value),
        },
      },
    ],
    series: [
      {
        name: t('statistic.udt_holders'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'holders',
        },
      },
      {
        name: t('statistic.udt_txs'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'txs',
        },
      },
    ],
    dataset: {
      source: data.map(item => [
        parseSimpleDate(+item.createdAtUnixtimestamp * 1000),
        item.holdersCount,
        item.ckbTransactionsCount,
      ]),
      dimensions: ['timestamp', 'holders', 'txs'],
    },
  }
}

const toCSV = (data: ChartItem.AssetActivity[]) =>
  data?.map(item => [item.createdAtUnixtimestamp, item.holdersCount, item.ckbTransactionsCount]) ?? []

export const AssetActivityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.asset_activity')}
      description={t('statistic.asset_activity_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticAssetActivity}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchAssetActivity"
    />
  )
}

export default AssetActivityChart
