import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import classNames from 'classnames'
import styles from './styles.module.scss'
import i18n from '../../utils/i18n'
import { ReactChartCore } from '../StatisticsChart/common'
import { ReactComponent as BikeIcon } from '../../assets/bike.svg'
import { ReactComponent as CarIcon } from '../../assets/car.svg'
import { ReactComponent as RocketIcon } from '../../assets/rocket.svg'
import { getPrimaryColor } from '../../constants/common'

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

export const FeeRateCards = ({ transactionFeeRates }: { transactionFeeRates: FeeRateTracker.TransactionFeeRate[] }) => {
  const getWeightedMedian = (tfrs: FeeRateTracker.TransactionFeeRate[]): number => {
    if (!tfrs || tfrs.length === 0) {
      return 0
    }
    return tfrs.length % 2 === 0
      ? (tfrs[tfrs.length / 2 - 1].confirmationTime + tfrs[tfrs.length / 2 - 1].confirmationTime) / 2
      : tfrs[(tfrs.length - 1) / 2].confirmationTime
  }

  const allFrs = [...transactionFeeRates.filter(r => r.confirmationTime === 0 || r.confirmationTime)].sort(
    (a, b) => a.confirmationTime - b.confirmationTime,
  )
  const avgConfirmationTime = getWeightedMedian(allFrs)
  const lowFrs = allFrs.filter(r => r.confirmationTime >= avgConfirmationTime)
  const lowConfirmationTime = getWeightedMedian(lowFrs)
  const highFrs = allFrs.filter(r => r.confirmationTime <= avgConfirmationTime)
  const highConfirmationTime = getWeightedMedian(highFrs)

  const calcFeeRate = (tfrs: FeeRateTracker.TransactionFeeRate[]): number =>
    tfrs.length === 0
      ? 0
      : BigNumber.sum(...tfrs.map(r => r.feeRate))
          .div(tfrs.length)
          .dp(3, BigNumber.ROUND_HALF_EVEN)
          .toNumber()

  const feeRateCards: FeeRateTracker.FeeRateCard[] = [
    {
      priority: i18n.t('fee_rate_tracker.low'),
      icon: <BikeIcon />,
      feeRate: calcFeeRate(lowFrs),
      priorityClass: styles.low,
      confirmationTime: lowConfirmationTime,
    },
    {
      priority: i18n.t('fee_rate_tracker.average'),
      icon: <CarIcon />,
      feeRate: calcFeeRate(allFrs),
      priorityClass: styles.average,
      confirmationTime: avgConfirmationTime,
    },
    {
      priority: i18n.t('fee_rate_tracker.high'),
      icon: <RocketIcon />,
      feeRate: calcFeeRate(highFrs),
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
          <div className={styles.shannonsPerByte}>
            {feeRate} {i18n.t('fee_rate_tracker.shannons_per_byte')}
          </div>
          <div className={styles.secs}>
            {confirmationTime >= 60
              ? `${Math.floor(confirmationTime / 60)} ${i18n.t('fee_rate_tracker.mins')}${
                  confirmationTime % 60 === 0 ? '' : ` ${confirmationTime % 60} ${i18n.t('fee_rate_tracker.secs')}`
                }`
              : `${confirmationTime} ${i18n.t('fee_rate_tracker.secs')}`}
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
  const confirmationTimeFeeRatesMap = new Map<number, number[]>()
  let minCt = Number.MAX_SAFE_INTEGER
  let maxCt = Number.MIN_SAFE_INTEGER
  transactionFeeRates.forEach(r => {
    if (r.confirmationTime === 0 || r.confirmationTime) {
      if (r.confirmationTime < minCt) minCt = r.confirmationTime
      if (r.confirmationTime > maxCt) maxCt = r.confirmationTime
      const feeRates = confirmationTimeFeeRatesMap.get(r.confirmationTime)
      if (feeRates) {
        feeRates.push(r.feeRate)
      } else {
        confirmationTimeFeeRatesMap.set(r.confirmationTime, [r.feeRate])
      }
    }
  })

  const confirmationTimeFeeRateX = maxCt >= minCt ? [...Array(maxCt - minCt + 1).keys()].map(i => i + minCt) : []
  const confirmationTimeFeeRateY = confirmationTimeFeeRateX.map(i => {
    const feeRates = confirmationTimeFeeRatesMap.get(i)
    return feeRates
      ? BigNumber.sum(...feeRates)
          .div(feeRates.length)
          .dp(1, BigNumber.ROUND_HALF_EVEN)
          .toNumber()
      : 0
  })

  return (
    <ReactChartCore
      option={{
        tooltip: {
          trigger: 'item',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params) {
            const param: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
            return `${i18n.t('fee_rate_tracker.fee_rate')}: ${param.value} ${i18n.t(
              'fee_rate_tracker.shannons_per_byte',
            )}<br />${i18n.t('fee_rate_tracker.confirmation_time')}: ${param.name} ${i18n.t('fee_rate_tracker.secs')}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${i18n.t('fee_rate_tracker.confirmation_time')} (${i18n.t('fee_rate_tracker.second')})`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: confirmationTimeFeeRateX,
        },
        yAxis: {
          type: 'value',
          nameGap: 54,
          nameRotate: 90,
          nameLocation: 'middle',
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
          name: `${i18n.t('fee_rate_tracker.fee_rate')}(${i18n.t('fee_rate_tracker.shannons_per_byte')})`,
        },
        series: [
          {
            data: confirmationTimeFeeRateY,
            type: 'bar',
            itemStyle: {
              color: getPrimaryColor(),
            },
          },
        ],
        grid: {
          left: '24%',
          right: '16%',
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
  const [feeRatePrecision, setFeeRatePrecision] = useState<number>(1)
  const [feeRateCeilFilter, setFeeRateCeilFilter] = useState<BigNumber | null>(null)

  let minFeeRate = Number.MAX_SAFE_INTEGER
  let maxFeeRate = Number.MIN_SAFE_INTEGER
  pendingTransactionFeeRates.forEach(r => {
    if (r.feeRate < minFeeRate) minFeeRate = r.feeRate
    if (r.feeRate > maxFeeRate) maxFeeRate = r.feeRate
  })

  const rootFeeRateTransactionCountX =
    maxFeeRate < minFeeRate
      ? []
      : [...Array(Math.floor(maxFeeRate * 10) - Math.floor(minFeeRate * 10) + 1).keys()].map(
          i => (i + Math.floor(minFeeRate * 10)) / 10,
        )

  const feeRateTransactionCountX =
    feeRatePrecision === 1 || !feeRateCeilFilter
      ? rootFeeRateTransactionCountX
      : [...Array(10).keys()].map(i =>
          feeRateCeilFilter.plus(new BigNumber(10).pow(-feeRatePrecision).multipliedBy(i)).toString(),
        )

  const feeRateTransactionCountY = feeRateTransactionCountX.map(
    tc =>
      pendingTransactionFeeRates.filter(fr =>
        new BigNumber(fr.feeRate)
          .dp(feeRatePrecision, BigNumber.ROUND_FLOOR)
          .isEqualTo(new BigNumber(tc).dp(feeRatePrecision, BigNumber.ROUND_FLOOR)),
      ).length,
  )

  useEffect(() => {
    if (feeRatePrecision !== 1 && !feeRateTransactionCountY.find(y => y !== 0)) {
      setFeeRatePrecision(1)
      setFeeRateCeilFilter(null)
    }
  }, [feeRatePrecision, feeRateTransactionCountY])

  return (
    <ReactChartCore
      option={{
        tooltip: {
          trigger: 'item',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params) {
            const param: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
            return `${param.name} ${i18n.t('fee_rate_tracker.shannons_per_byte')}<br />${i18n.t(
              'fee_rate_tracker.transaction_count',
            )}: ${param.value}`
          },
        },
        xAxis: {
          type: 'category',
          data: feeRateTransactionCountX,
          name: `${i18n.t('fee_rate_tracker.fee_rate')} (${i18n.t('fee_rate_tracker.shannons_per_byte')})`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          nameGap: 54,
          nameRotate: 90,
          nameLocation: 'middle',
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
          name: i18n.t('fee_rate_tracker.transaction_count'),
        },
        series: [
          {
            data: feeRateTransactionCountY,
            type: 'bar',
            itemStyle: {
              color: getPrimaryColor(),
            },
          },
        ],
        grid: {
          left: '24%',
          right: '16%',
        },
        graphic:
          feeRatePrecision > 1
            ? [
                {
                  type: 'text',
                  right: 80,
                  top: 4,
                  style: {
                    text: `← ${i18n.t('fee_rate_tracker.back')}`,
                    fontSize: 18,
                  },
                  onclick: () => {
                    if (feeRatePrecision > 1) {
                      if (feeRatePrecision === 2) {
                        setFeeRateCeilFilter(null)
                      } else {
                        setFeeRateCeilFilter(cf => (cf ? cf.dp(feeRatePrecision - 1, BigNumber.ROUND_FLOOR) : null))
                      }
                      setFeeRatePrecision(p => p - 1)
                    }
                  },
                },
              ]
            : [],
      }}
      notMerge
      lazyUpdate
      style={{
        height: '100%',
        width: '100%',
      }}
      clickEvent={({ name }: { name: string }) => {
        if (!name || feeRatePrecision > 3) {
          return
        }
        setFeeRateCeilFilter(new BigNumber(name))
        setFeeRatePrecision(p => p + 1)
      }}
    />
  )
}

export const FeeRateTransactionCountChart = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  return useMemo(() => {
    return <FeeRateTransactionCountChartCore pendingTransactionFeeRates={pendingTransactionFeeRates} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransactionFeeRates, i18n.language])
}

export const LastNDaysTransactionFeeRateChart = ({
  lastNDaysTransactionFeeRates,
}: {
  lastNDaysTransactionFeeRates: FeeRateTracker.LastNDaysTransactionFeeRate[]
}) => {
  const sortedLastNDaysTransactionFeeRates = lastNDaysTransactionFeeRates
    .filter(r => dayjs(r.date).isValid())
    .sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))

  return (
    <ReactChartCore
      option={{
        tooltip: {
          trigger: 'item',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params) {
            const param: echarts.EChartOption.Tooltip.Format = Array.isArray(params) ? params[0] : params
            const feeRate = sortedLastNDaysTransactionFeeRates.find(r => dayjs(r.date).format('MM/DD') === param.name)
            return `${i18n.t('fee_rate_tracker.date')}: ${
              feeRate ? dayjs(feeRate.date).format('YYYY/MM/DD') : ''
            }<br />${i18n.t('fee_rate_tracker.average_fee_rate')}: ${param.value} ${i18n.t(
              'fee_rate_tracker.shannons_per_byte',
            )}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${i18n.t('fee_rate_tracker.date')}`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: sortedLastNDaysTransactionFeeRates.map(r => dayjs(r.date).format('MM/DD')),
        },
        yAxis: {
          type: 'value',
          nameGap: 54,
          nameRotate: 90,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: { ...textStyleInChart, margin: 2 },
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
          name: `${i18n.t('fee_rate_tracker.fee_rate')}(${i18n.t('fee_rate_tracker.shannons_per_byte')})`,
        },
        series: [
          {
            data: sortedLastNDaysTransactionFeeRates.map(r => Math.round(Number(r.feeRate))),
            type: 'line',
            itemStyle: {
              color: getPrimaryColor(),
            },
          },
        ],
        grid: {
          left: '24%',
          right: '16%',
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
