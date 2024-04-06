import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
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

    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            if (!Array.isArray(dataList)) return ''
            const params = dataList[0]
            if (!params) return ''
            if (!Array.isArray(params.value)) return ''
            const [addrCount, ckbAmount, txCount, codeHash, tag, hashType] = params.value
            const script = tag || `<div style="white-space: pre">Code Hash: ${codeHash}\nHash Type: ${hashType}</div>`
            return `<table>
                      <tr>
                        <td>Script: </td>
                        <td>${script}</td>
                      </tr>
                      <tr>
                        <td>Addresses: </td>
                        <td>${Number(addrCount).toLocaleString('en')}</td>
                      </tr>
                      <tr>
                        <td>CKB: </td>
                        <td>${Number(ckbAmount).toLocaleString('en')}</td>
                      </tr>
                      <tr>
                        <td>Transactions: </td>
                        <td>${Number(txCount).toLocaleString('en')}</td>
                      </tr>
                    </table>`
          },
        }
      : undefined,
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
    // TODO: add visual map when txs/24h is ready
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
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const history = useHistory()

  const handleClick = useCallback(
    (params: echarts.CallbackDataParams) => {
      const codeHash = params.value[3]
      const hashType = params.value[5]
      const url = `/${language}/script/${codeHash}/${hashType}`
      history.push(url)
    },
    [history, language],
  )

  return (
    <SmartChartPage
      title={t('statistic.contract_resource_distributed')}
      description={t('statistic.contract_resource_distributed_description')}
      isThumbnail={isThumbnail}
      chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
      fetchData={explorerService.api.fetchContractResourceDistributed}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchContractResourceDistributed"
    />
  )
}

export default ContractResourceDistributedChart
