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
  const h24TxCountSortedList: number[] = statisticContractResourceDistributed
    .map(data => Number(data.h24TxCount))
    .sort((a, b) => b - a)

  return {
    color: chartColor.colors,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    tooltip: !isThumbnail
      ? {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
          },
          formatter: params => {
            if (params && 'data' in params) {
              const [addrCount, ckbAmount, txCount, codeHash, tag, hashType, h24TxCount] = params.data
              const script = tag || `<div style="white-space: pre">Code Hash: ${codeHash}\nHash Type: ${hashType}</div>`
              return `<table>
                      <tr>
                        <td>Script:</td>
                        <td>${script}</td>
                      </tr>
                      <tr>
                        <td>${t('statistic.address')}: </td>
                        <td>${Number(addrCount).toLocaleString('en')}</td>
                      </tr>
                      <tr>
                        <td>CKB: </td>
                        <td>${Number(ckbAmount).toLocaleString('en')}</td>
                      </tr>
                      <tr>
                        <td>${t('statistic.transaction_count')}: </td>
                        <td>${Number(txCount).toLocaleString('en')}</td>
                      </tr>
                      <tr>
                        <td>${t('statistic.h24_transaction_count')}: </td>
                        <td>${Number(h24TxCount).toLocaleString('en')}</td>
                      </tr>
                    </table>`
            }
            return ''
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
    visualMap: [
      {
        min:
          h24TxCountSortedList[h24TxCountSortedList.length - 1] === undefined
            ? 0
            : h24TxCountSortedList[h24TxCountSortedList.length - 1],
        max: h24TxCountSortedList[0] === undefined ? 200 : h24TxCountSortedList[0],
        dimension: 6,
        orient: 'vertical',
        right: 10,
        top: 'center',
        text: ['HIGH', 'LOW'],
        calculable: true,
        itemWidth: 4,
        show: !isThumbnail,
        inRange: {
          color: ['#F7C242', '#F75C2F'],
        },
      },
    ],
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
        data.h24TxCount,
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
        data.h24TxCount,
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
