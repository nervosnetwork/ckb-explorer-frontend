import { useTranslation } from 'react-i18next'
import type { EChartsOption, TooltipComponentOption } from 'echarts'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { explorerService } from '../../../services/ExplorerService'
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

interface VersionRecord {
  version: string
  percent: number
}

const useOption = (
  list: VersionRecord[],
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
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  const tooltip: TooltipComponentOption | undefined = !isThumbnail
    ? {
        formatter: data => {
          const item = Array.isArray(data) ? data[0] : data
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 80 : 60)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.version'))} ${
            (item.data as Record<string, string>).title
          }</div>`
          result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.percent'))} ${
            (item.data as Record<string, string>).value
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
        name: t('statistic.miner_version_distribution'),
        type: 'pie',
        radius: isMobile || isThumbnail ? '50%' : '75%',
        center: ['50%', '50%'],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0)',
          },
        },
        data: list.map(data => {
          const version = data.version === 'others' ? t(`statistic.others`) : data.version
          return {
            name: `${version} (${data.percent}%)`,
            title: version,
            value: data.percent,
          }
        }),
      },
    ],
  }
}

const fetchData = async () => {
  const { data: list } = await explorerService.api.fetchStatisticMinerVersionDistribution()
  const totalBlocks = list.reduce((acc, cur) => acc + cur.blocksCount, 0)
  return list.map(v => ({
    version: v.version,
    percent: +((100 * v.blocksCount) / totalBlocks).toFixed(2),
  }))
}

const toCSV = (versionList: VersionRecord[]) => versionList?.map(r => [r.version, `${r.percent}%`]) ?? []

export const MinerVersionDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.miner_version_distribution')}
      isThumbnail={isThumbnail}
      fetchData={fetchData}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticMinerVersionDistribution"
    />
  )
}

export default MinerVersionDistributionChart
