import { useState } from 'react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { TFunction, useTranslation } from 'react-i18next'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '../../../utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { ChartItem, explorerService } from '../../../services/ExplorerService'
import { ChartColorConfig, IS_MAINNET } from '../../../constants/common'
import styles from './styles.module.scss'

const useOption =
  ({ type, t, language }: { type: 'log' | 'linear'; t: TFunction; language: string }) =>
  (
    statisticTransactionCounts: ChartItem.TransactionCount[],
    chartColor: ChartColorConfig,
    isMobile: boolean,

    isThumbnail = false,
  ): echarts.EChartOption => {
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
              const widthSpan = (value: string) => tooltipWidth(value, language === 'en' ? 120 : 65)
              let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${
                dataList[0].data[0]
              }</div>`
              result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(
                t('statistic.transaction_count'),
              )} ${handleAxis(dataList[0].data[1], 2)}</div>`
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
        },
      ],
      yAxis: [
        {
          position: 'left',
          name:
            isMobile || isThumbnail
              ? ''
              : `${t('statistic.transaction_count')} ${t(type === 'log' ? 'statistic.log' : '')}`,
          type: type === 'log' ? 'log' : 'value',
          logBase: 10,
          scale: true,
          axisLine: {
            lineStyle: {
              color: chartColor.colors[0],
            },
          },
          axisLabel: {
            formatter: (value: string) => handleAxis(new BigNumber(value)),
          },
        },
      ],
      series: [
        {
          name: t('statistic.transaction_count'),
          type: 'line',
          yAxisIndex: 0,
          symbol: isThumbnail ? 'none' : 'circle',
          symbolSize: 3,
        },
      ],
      dataset: {
        source: statisticTransactionCounts.map(data => [
          dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
          new BigNumber(data.transactionsCount).toNumber(),
        ]),
      },
    }
  }

const toCSV = (statisticTransactionCounts: ChartItem.TransactionCount[]) =>
  statisticTransactionCounts
    ? statisticTransactionCounts.map(data => [data.createdAtUnixtimestamp, data.transactionsCount])
    : []

export const TransactionCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { t, i18n } = useTranslation()

  const [scaleType, setScaleType] = useState<'linear' | 'log'>(IS_MAINNET ? 'log' : 'linear')

  const onScaleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleType(e.target.value as 'linear' | 'log')
  }

  const chart = (
    <SmartChartPage
      title={t('statistic.transaction_count')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticTransactionCount}
      getEChartOption={useOption({ type: scaleType, t, language: i18n.language })}
      toCSV={toCSV}
      queryKey="fetchStatisticTransactionCount"
    />
  )

  if (isThumbnail) return chart

  return (
    <div className={styles.container}>
      {chart}
      <div className={styles.scaleSelector}>
        <input
          type="radio"
          id="linear"
          name="scaleType"
          value="linear"
          checked={scaleType === 'linear'}
          onChange={onScaleTypeChange}
        />
        <label htmlFor="linear">Linear Scale</label>
        <input
          type="radio"
          id="log"
          name="scaleType"
          value="log"
          checked={scaleType === 'log'}
          onChange={onScaleTypeChange}
        />
        <label htmlFor="log">Log Scale</label>
      </div>
    </div>
  )
}

export default TransactionCountChart
