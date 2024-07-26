import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { SupportedLng, useCurrentLanguage } from '../../../utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsItem,
  assertSerialsDataIsStringArrayOf10,
  handleAxis,
} from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

const widthSpan = (value: string, currentLanguage: SupportedLng) =>
  tooltipWidth(value, currentLanguage === 'en' ? 125 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({
    seriesName,
    data,
    color,
  }: SeriesItem & {
    data: [string, string, string, string, string, string, string, string, string, string]
  }): string => {
    if (seriesName === t('statistic.24h')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.24h'), currentLanguage)} ${handleAxis(data[1], 2)}%
      </div>`
    }

    if (seriesName === t('statistic.day_to_one_week')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.day_to_one_week'), currentLanguage)} ${handleAxis(
        data[2],
        2,
      )}%</div>`
    }

    if (seriesName === t('statistic.one_week_to_one_month')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_week_to_one_month'),
        currentLanguage,
      )} ${handleAxis(data[3], 2)}%</div>`
    }
    if (seriesName === t('statistic.one_month_to_three_months')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_month_to_three_months'),
        currentLanguage,
      )} ${handleAxis(data[4], 2)}%</div>`
    }
    if (seriesName === t('statistic.three_months_to_six_months')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.three_months_to_six_months'),
        currentLanguage,
      )} ${handleAxis(data[5], 2)}%</div>`
    }
    if (seriesName === t('statistic.six_months_to_one_year')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.six_months_to_one_year'),
        currentLanguage,
      )} ${handleAxis(data[6], 2)}%</div>`
    }
    if (seriesName === t('statistic.one_year_to_three_years')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_year_to_three_years'),
        currentLanguage,
      )} ${handleAxis(data[7], 2)}%</div>`
    }
    if (seriesName === t('statistic.over_three_years')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.over_three_years'), currentLanguage)} ${handleAxis(
        data[8],
        2,
      )}%</div>`
    }
    if (seriesName === t('statistic.holder_count')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.holder_count'), currentLanguage)} ${data[9]}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticCkbHodlWaves: ChartItem.CkbHodlWaveHolderCount[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
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
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  const colors = [...chartColor.moreColors].slice(0, 9)
  return {
    color: colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)}
          ${dataList[0].data[0]}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsStringArrayOf10(data)
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    legend: {
      data: isThumbnail
        ? []
        : [
            {
              name: t('statistic.24h'),
            },
            {
              name: t('statistic.day_to_one_week'),
            },
            {
              name: t('statistic.one_week_to_one_month'),
            },
            {
              name: t('statistic.one_month_to_three_months'),
            },
            {
              name: t('statistic.three_months_to_six_months'),
            },
            {
              name: t('statistic.six_months_to_one_year'),
            },
            {
              name: t('statistic.one_year_to_three_years'),
            },
            {
              name: t('statistic.over_three_years'),
            },
            {
              name: t('statistic.holder_count'),
            },
          ],
      selected: {
        [t('statistic.24h')]: true,
        [t('statistic.day_to_one_week')]: true,
        [t('statistic.one_week_to_one_month')]: true,
        [t('statistic.one_month_to_three_months')]: true,
        [t('statistic.three_months_to_six_months')]: true,
        [t('statistic.six_months_to_one_year')]: true,
        [t('statistic.one_year_to_three_years')]: true,
        [t('statistic.over_three_years')]: true,
        [t('statistic.holder_count')]: true,
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        type: 'value',
        max: 100,
        axisLine: {
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
      {
        position: 'right',
        type: 'value',
        name: 'Holder count',
        axisLine: {
          lineStyle: {
            color: colors[1],
          },
          onZero: false,
        },
      },
    ],
    series: [
      {
        name: t('statistic.24h'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          color: colors[0],
        },
      },
      {
        name: t('statistic.day_to_one_week'),
        type: 'line',
        stack: 'sum',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: colors[1],
        },
      },
      {
        name: t('statistic.one_week_to_one_month'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[2],
        },
      },
      {
        name: t('statistic.one_month_to_three_months'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[3],
        },
      },
      {
        name: t('statistic.three_months_to_six_months'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[4],
        },
      },
      {
        name: t('statistic.six_months_to_one_year'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[5],
        },
      },
      {
        name: t('statistic.one_year_to_three_years'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[6],
        },
      },
      {
        name: t('statistic.over_three_years'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[7],
        },
      },
      {
        name: t('statistic.holder_count'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          color: colors[8],
        },
      },
    ],
    dataset: {
      source: statisticCkbHodlWaves.map(data => [
        dayjs(Number(data.createdAtUnixtimestamp) * 1000).format('MM/DD/YYYY'),
        ((data.ckbHodlWave.latestDay / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.dayToOneWeek / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneWeekToOneMonth / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneMonthToThreeMonths / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.threeMonthsToSixMonths / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.sixMonthsToOneYear / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneYearToThreeYears / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.overThreeYears / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        data.holderCount,
      ]),
      dimensions: ['timestamp', '24h', '1d-1w', '1w-3m', '1m-3m', '3m-6m', '6m-1y', '1y-3y', '> 3y', 'holder_count'],
    },
  }
}

const toCSV = (statisticCkbHodlWaves: ChartItem.CkbHodlWaveHolderCount[]) =>
  statisticCkbHodlWaves
    ? statisticCkbHodlWaves.map(data => [
        data.createdAtUnixtimestamp,
        data.ckbHodlWave.latestDay,
        data.ckbHodlWave.dayToOneWeek,
        data.ckbHodlWave.oneWeekToOneMonth,
        data.ckbHodlWave.threeMonthsToSixMonths,
        data.ckbHodlWave.sixMonthsToOneYear,
        data.ckbHodlWave.oneYearToThreeYears,
        data.ckbHodlWave.overThreeYears,
        data.holderCount,
      ])
    : []

export const CkbHodlWaveChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.ckb_hodl_wave')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticCkbHodlWave}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticCkbHodlWave"
    />
  )
}

export default CkbHodlWaveChart
