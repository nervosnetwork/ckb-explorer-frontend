import BigNumber from 'bignumber.js'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ReactChartCore } from '../StatisticsChart/common'
import { ReactComponent as BikeIcon } from './bike.svg'
import { ReactComponent as CarIcon } from './car.svg'
import { ReactComponent as RocketIcon } from './rocket.svg'
import { ChartColor } from '../../constants/common'
import { useCurrentLanguage } from '../../utils/i18n'
import type { FeeRateTracker } from '../../services/ExplorerService'
import { handleAxis } from '../../utils/chart'
import styles from './styles.module.scss'

const textStyleInChart: echarts.EChartOption.TextStyle = {
  color: '#999999',
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 16,
}

const textStyleOfTooltip: echarts.EChartOption.TextStyle = {
  color: '#ffffff',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 18,
}

const getWeightedMedian = (tfrs: FeeRateTracker.TransactionFeeRate[]): number => {
  if (tfrs?.length === 0) {
    return 0
  }
  return tfrs.length % 2 === 0
    ? (tfrs[tfrs.length / 2 - 1].confirmationTime + tfrs[tfrs.length / 2].confirmationTime) / 2
    : tfrs[(tfrs.length - 1) / 2].confirmationTime
}

const calcFeeRate = (tfrs: FeeRateTracker.TransactionFeeRate[]): string =>
  tfrs.length === 0
    ? '0'
    : Math.round(tfrs.reduce((acc, cur) => acc + cur.feeRate * 1000, 0) / tfrs.length).toLocaleString('en')

const colors = ChartColor.moreColors

export const FeeRateCards = ({ transactionFeeRates }: { transactionFeeRates: FeeRateTracker.TransactionFeeRate[] }) => {
  const { t } = useTranslation()
  const allFrs = transactionFeeRates.sort((a, b) => a.confirmationTime - b.confirmationTime)
  const avgConfirmationTime = getWeightedMedian(allFrs)

  const lowFrs = allFrs.filter(r => r.confirmationTime >= avgConfirmationTime)
  const lowConfirmationTime = getWeightedMedian(lowFrs)

  const highFrs = allFrs.filter(r => r.confirmationTime <= avgConfirmationTime)
  const highConfirmationTime = getWeightedMedian(highFrs)

  const list = [lowFrs, allFrs, highFrs].map(calcFeeRate)
  let low = list[0]
  let medium = list[1]
  const high = list[2]

  if (+medium.replace(/,/g, '') > +high.replace(/,/g, '')) {
    medium = high
  }
  if (+low.replace(/,/g, '') > +medium.replace(/,/g, '')) {
    low = medium
  }

  const feeRateCards: FeeRateTracker.FeeRateCard[] = [
    {
      priority: t('fee_rate_tracker.low'),
      icon: <BikeIcon />,
      feeRate: low,
      priorityClass: styles.low,
      confirmationTime: lowConfirmationTime,
    },
    {
      priority: t('fee_rate_tracker.average'),
      icon: <CarIcon />,
      feeRate: medium,
      priorityClass: styles.average,
      confirmationTime: avgConfirmationTime,
    },
    {
      priority: t('fee_rate_tracker.high'),
      icon: <RocketIcon />,
      feeRate: high,
      priorityClass: styles.high,
      confirmationTime: highConfirmationTime,
    },
  ]

  return (
    <>
      {feeRateCards.map(({ priority, icon, feeRate, priorityClass, confirmationTime }) => (
        <div className={classNames(styles.card, priorityClass)} key={priority}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.priority}>{priority}</div>
          <div className={styles.shannonsPerByte}>{`${feeRate} shannons/kB`}</div>
          <div className={styles.secs}>
            {confirmationTime >= 60
              ? `${Math.floor(confirmationTime / 60)} ${t('fee_rate_tracker.mins')}${
                  confirmationTime % 60 === 0 ? '' : ` ${confirmationTime % 60} ${t('fee_rate_tracker.secs')}`
                }`
              : `${confirmationTime} ${t('fee_rate_tracker.secs')}`}
          </div>
        </div>
      ))}
    </>
  )
}

export const ConfirmationTimeFeeRateChart = ({
  transactionFeeRates,
}: {
  transactionFeeRates: FeeRateTracker.TransactionFeeRate[]
}) => {
  const { t } = useTranslation()
  const data = transactionFeeRates.reduce<number[][]>((acc, cur) => {
    if (!cur.confirmationTime) {
      return acc
    }
    const range = Math.floor((cur.confirmationTime - 1) / 10)
    if (!Array.isArray(acc[range])) {
      acc[range] = []
    }
    acc[range].push(cur.feeRate * 1000)
    return acc
  }, [])

  return (
    <ReactChartCore
      option={{
        color: colors,
        tooltip: {
          trigger: 'axis',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params) {
            const feeRate: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
            const count: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[1] : params
            if (!feeRate.value) return ''
            return `${t('fee_rate_tracker.fee_rate')}: ${feeRate.value?.toLocaleString('en')} shannons/kB<br />${t(
              'fee_rate_tracker.confirmation_time',
            )}: ${feeRate.name}<br />${t('fee_rate_tracker.count')}: ${count.value}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${t('fee_rate_tracker.confirmation_time')} (${t('fee_rate_tracker.seconds')})`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisTick: {
            show: false,
          },
          data: Array.from({ length: data.length }, (_, idx) => `${idx * 10} ~ ${idx * 10 + 10}s`),
        },
        yAxis: [
          {
            position: 'left',
            type: 'value',
            nameLocation: 'end',
            nameTextStyle: { ...textStyleInChart, color: colors[0] },
            axisLabel: {
              ...textStyleInChart,
              color: ChartColor.moreColors[0],
              formatter: (v: number) => `${(v / 1000).toLocaleString('en')}k`,
            },
            axisLine: {
              lineStyle: {
                color: colors[0],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: '#e5e5e5',
              },
            },
            name: `${t('fee_rate_tracker.fee_rate')}(shannons/kB)`,
          },
          {
            position: 'right',
            type: 'value',
            nameLocation: 'end',
            nameTextStyle: { ...textStyleInChart, color: colors[1] },
            axisLabel: {
              ...textStyleInChart,
              color: colors[1],
              formatter: (v: number) => v.toLocaleString('en'),
            },
            axisLine: {
              lineStyle: {
                color: colors[1],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            name: `${t('fee_rate_tracker.count')}`,
          },
        ],
        series: [
          {
            yAxisIndex: 0,
            data: data.map(feeList =>
              feeList.length ? Math.round(feeList.reduce((acc, cur) => acc + cur) / feeList.length) : 0,
            ),
            type: 'bar',
            barMaxWidth: 6,
          },
          {
            yAxisIndex: 1,
            data: data.map(feeList => feeList.length),
            type: 'bar',
            barMaxWidth: 6,
          },
        ],
        grid: {
          containLabel: true,
        },
      }}
      notMerge
      lazyUpdate
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  )
}

export const FeeRateTransactionCountChartCore = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  const { t } = useTranslation()
  const feeRateCount = pendingTransactionFeeRates.reduce((acc, cur) => {
    const count = acc.get(cur.feeRate) ?? 0
    acc.set(cur.feeRate, count + 1)
    return acc
  }, new Map())

  const feeRateCountList = [...feeRateCount.entries()].sort((a, b) => a[0] - b[0])

  return (
    <ReactChartCore
      option={{
        color: ChartColor.moreColors,
        tooltip: {
          trigger: 'item',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params) {
            const param: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
            return `${param.name} shannons/kB<br />${t('fee_rate_tracker.transaction_count')}: ${param.value}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${t('fee_rate_tracker.fee_rate')} (shannons/kB)`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          data: feeRateCountList.map(([feeRate]) => new BigNumber(+feeRate * 1000).toFormat(0)),
        },
        yAxis: {
          position: 'left',
          type: 'value',
          nameLocation: 'end',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#e5e5e5',
            },
          },
          name: t('fee_rate_tracker.transaction_count'),
        },
        series: [
          {
            data: feeRateCountList.map(([, count]) => count),
            type: 'bar',
            barMaxWidth: 6,
          },
        ],
        grid: {
          containLabel: true,
        },
      }}
      notMerge
      lazyUpdate
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  )
}

export const FeeRateTransactionCountChart = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  const currentLanguage = useCurrentLanguage()
  return useMemo(() => {
    return <FeeRateTransactionCountChartCore pendingTransactionFeeRates={pendingTransactionFeeRates} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransactionFeeRates, currentLanguage])
}

export const LastNDaysTransactionFeeRateChart = ({
  lastNDaysTransactionFeeRates,
}: {
  lastNDaysTransactionFeeRates: FeeRateTracker.LastNDaysTransactionFeeRate[]
}) => {
  const [scaleType, setScaleType] = useState<'linear' | 'log'>('log')
  const { t } = useTranslation()
  const sortedLastNDaysTransactionFeeRates = lastNDaysTransactionFeeRates
    .filter(r => dayjs(r.date).isValid())
    .sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))

  const onScaleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleType(e.target.value as 'linear' | 'log')
  }

  return (
    <>
      <ReactChartCore
        option={{
          color: ChartColor.moreColors,
          tooltip: {
            trigger: 'item',
            position: 'top',
            textStyle: textStyleOfTooltip,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            formatter(params) {
              const param: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
              const feeRate = sortedLastNDaysTransactionFeeRates.find(r => dayjs(r.date).format('MM/DD') === param.name)
              return `${t('fee_rate_tracker.date')}: ${
                feeRate ? dayjs(feeRate.date).format('YYYY/MM/DD') : ''
              }<br />${t('fee_rate_tracker.average_fee_rate')}: ${param.value?.toLocaleString('en')} shannons/kB`
            },
          },
          xAxis: {
            type: 'category',
            name: `${t('fee_rate_tracker.date')}`,
            nameGap: 32,
            nameLocation: 'middle',
            nameTextStyle: textStyleInChart,
            axisLabel: textStyleInChart,
            axisTick: {
              show: false,
            },
            data: sortedLastNDaysTransactionFeeRates.map(r => dayjs(r.date).format('MM/DD')),
          },
          yAxis: {
            type: scaleType === 'log' ? 'log' : 'value',
            nameLocation: 'end',
            nameTextStyle: { ...textStyleInChart, color: colors[0] },
            axisLabel: {
              ...textStyleInChart,
              color: colors[0],
              margin: 2,
              formatter: (value: string) => handleAxis(new BigNumber(value)),
            },
            axisLine: {
              lineStyle: {
                color: colors[0],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: '#e5e5e5',
              },
            },
            name: `${t('fee_rate_tracker.fee_rate')}(shannons/kB) ${scaleType === 'log' ? t('statistic.log') : ''}`,
          },
          series: [
            {
              data: sortedLastNDaysTransactionFeeRates.map(r => Math.round(Number(r.feeRate) * 1000)),
              type: 'line',
            },
          ],
          grid: {
            containLabel: true,
          },
        }}
        notMerge
        lazyUpdate
        style={{
          height: '100%',
          width: '100%',
        }}
      />
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
    </>
  )
}
