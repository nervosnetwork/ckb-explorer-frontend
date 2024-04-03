import { useTranslation } from 'react-i18next'
import { EChartOption } from 'echarts'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { getPeers, RawPeer } from '../../../services/NodeProbService'
import { useCurrentLanguage } from '../../../utils/i18n'
import { ChartColorConfig } from '../../../constants/common'

const Colors = [
  '#069ECD',
  '#69C7D4',
  '#AACFE9',
  '#29B97A',
  '#66CC99',
  '#228159',
  '#525860',
  '#74808E',
  '#9DA6B0',
  '#FBB04C',
]

interface CountryRecord {
  country: string
  percent: number
}

const useOption = (
  list: CountryRecord[],
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
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  const tooltip: EChartOption.Tooltip | undefined = !isThumbnail
    ? {
        formatter: data => {
          const item = Array.isArray(data) ? data[0] : data
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 100 : 120)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.country'))} ${item.data.title}</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.percent'))} ${
            item.data.value
          }%</div>`
          return result
        },
      }
    : {
        show: false,
      }

  return {
    color: [chartColor.colors[0], ...Colors],
    tooltip,
    grid: isThumbnail ? gridThumbnail : grid,
    legend: {
      show: !isThumbnail,
      right: 40,
      bottom: 40,
      orient: 'vertical',
      icon: 'circle',
    },
    series: [
      {
        name: t('statistic.node_country_distribution'),
        type: 'pie',
        radius: isMobile || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: list.map(data => {
          const country = data.country === 'others' ? t(`statistic.others`) : data.country
          return {
            name: `${country} (${data.percent}%)`,
            title: country,
            value: data.percent,
          }
        }),
      },
    ],
  }
}

const fetchData = async (): Promise<CountryRecord[]> => {
  const list: RawPeer[] = await getPeers()
  const result: { key: string; value: number } = list.reduce((acc: any, cur: any) => {
    acc[cur.country] = (acc[cur.country] || 0) + 1
    return acc
  }, {})
  return Object.entries(result).map(v => ({
    country: v[0],
    percent: +(((v[1] as number) * 100) / list.length).toFixed(2),
  }))
}

const toCSV = (countryList: CountryRecord[]) => countryList?.map(r => [r.country, `${r.percent}%`]) ?? []

export const NodeCountryDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.node_country_distribution')}
      isThumbnail={isThumbnail}
      fetchData={fetchData}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticNodeCountryDistribution"
    />
  )
}

export default NodeCountryDistributionChart
