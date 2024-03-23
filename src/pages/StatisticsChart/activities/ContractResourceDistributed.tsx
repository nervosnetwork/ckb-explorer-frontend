import { useTranslation } from 'react-i18next'
import { DATA_ZOOM_CONFIG, handleAxis } from '../../../utils/chart'
import { SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig } from '../../../constants/common'

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
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'log',
        splitLine: { show: false },
        name: isMobile || isThumbnail ? '' : t('statistic.ckb_amount'),
        axisLabel: {
          formatter: (value: string) => handleAxis(value),
        },
      },
    ],
    tooltip: {
      position: 'top',
      enterable: true,
      formatter: (params: any) => {
        return `<a href=${window.location.origin}/script/${params.value[3]}/${params.value[5]} target=_blank>${
          params.value[4] || params.value[3]
        }</a>`
      },
    },
    series: [
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: (data: number[]) => {
          const ratio = isThumbnail ? 500 : 50
          const min = isThumbnail ? 1 : 10
          const size = Math.sqrt(data[2]) / ratio
          return size < min ? min : size
        },
      },
    ],
    dataset: {
      source: statisticContractResourceDistributed.map(data => [
        data.addressCount,
        data.ckbAmount,
        data.txCount,
        data.codeHash,
        data.name,
        data.hashType,
      ]),
    },
  }
}

const toCSV = (statisticContractResourceDistributed: ChartItem.ContractResourceDistributed[]) =>
  statisticContractResourceDistributed
    ? statisticContractResourceDistributed.map(data => [
        data.name,
        data.codeHash,
        data.hashType,
        data.txCount,
        data.ckbAmount,
        data.addressCount,
      ])
    : []

export const ContractResourceDistributedChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.contract_resource_distributed')}
      description={t('statistic.contract_resource_distributed_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchContractResourceDistributed}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchContractResourceDistributed"
    />
  )
}

export default ContractResourceDistributedChart
