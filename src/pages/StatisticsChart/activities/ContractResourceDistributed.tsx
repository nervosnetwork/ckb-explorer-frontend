import { useTranslation } from 'react-i18next'
import { DATA_ZOOM_CONFIG } from '../../../utils/chart'
import { SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'
import { shannonToCkbDecimal } from '../../../utils/util'

const useOption = (
  statisticContractResourceDistributed: ChartItem.ContractResourceDistributed[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
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
  return {
    color: chartColor.colors,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.address_count'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'log',
        logBase: 100000,
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'log',
        splitLine: { show: false },
        name: isMobile || isThumbnail ? '' : t('statistic.ckb_amount'),
      },
    ],
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return params.value[4] || params.value[3]
      },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: number[]) => {
          const ratio = isThumbnail ? 500 : 100
          return Math.sqrt(data[2]) / ratio
        },
      },
    ],
    dataset: {
      source: statisticContractResourceDistributed.map(data => [
        data.addressCount === '0' ? null : data.addressCount,
        shannonToCkbDecimal(data.capacityAmount, 8) === 0 ? null : shannonToCkbDecimal(data.capacityAmount, 8),
        data.txCount,
        data.codeHash,
        data.name,
      ]),
    },
  }
}

const toCSV = (statisticContractResourceDistributed: ChartItem.ContractResourceDistributed[]) =>
  statisticContractResourceDistributed
    ? statisticContractResourceDistributed.map(data => [
        data.name,
        data.codeHash,
        data.txCount,
        shannonToCkbDecimal(data.capacityAmount, 8),
        data.addressCount,
      ])
    : []

export const ContractResourceDistributedChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.contract_resource_distributed')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchContractResourceDistributed}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchContractResourceDistributed"
    />
  )
}

export default ContractResourceDistributedChart
