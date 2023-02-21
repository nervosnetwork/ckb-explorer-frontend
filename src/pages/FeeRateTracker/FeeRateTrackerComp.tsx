import { Col, Row } from 'antd'
import BigNumber from 'bignumber.js'
import echarts from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import styles from './styles.module.scss'
import { useIsLGScreen } from '../../utils/hook'
import i18n from '../../utils/i18n'
import { useAppState } from '../../contexts/providers'

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

  const feeRateCards: FeeRateTracker.FeeRateCard[] = [
    {
      priority: i18n.t('fee_rate_tracker.low'),
      tfrs: lowFrs,
      confirmationTime: lowConfirmationTime,
    },
    {
      priority: i18n.t('fee_rate_tracker.average'),
      tfrs: allFrs,
      confirmationTime: avgConfirmationTime,
    },
    {
      priority: i18n.t('fee_rate_tracker.high'),
      tfrs: highFrs,
      confirmationTime: highConfirmationTime,
    },
  ].map(c => {
    const feeRate =
      c.tfrs.length === 0
        ? 0
        : BigNumber.sum(...c.tfrs.map(r => r.feeRate))
            .div(c.tfrs.length)
            .dp(3, BigNumber.ROUND_HALF_EVEN)
            .toNumber()
    return {
      priority: c.priority,
      feeRate,
      confirmationTime: c.confirmationTime,
    }
  })

  return (
    <Row justify="space-evenly" className={styles.priceCenter}>
      {feeRateCards.map(c => (
        <Col span={6} key={c.priority}>
          <div className={styles.card}>
            <div>{c.priority}</div>
            <div>
              {c.feeRate} {i18n.t('fee_rate_tracker.shannons_per_byte')}
            </div>
            <div>
              {c.confirmationTime >= 60
                ? `${Math.floor(c.confirmationTime / 60)} ${i18n.t('fee_rate_tracker.mins')}${
                    c.confirmationTime % 60 === 0
                      ? ''
                      : ` ${c.confirmationTime % 60} ${i18n.t('fee_rate_tracker.secs')}`
                  }`
                : `${c.confirmationTime} ${i18n.t('fee_rate_tracker.secs')}`}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  )
}

export const ConfirmationTimeFeeRateChart = ({
  transactionFeeRates,
}: {
  transactionFeeRates: FeeRateTracker.TransactionFeeRate[]
}) => {
  const isLG = useIsLGScreen()
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
    <ReactEchartsCore
      echarts={echarts}
      option={{
        xAxis: {
          type: 'category',
          name: `${i18n.t('fee_rate_tracker.confirmation_time')} (${i18n.t('fee_rate_tracker.second')})`,
          nameGap: 32,
          nameLocation: 'middle',
          axisTick: {
            alignWithLabel: true,
          },
          data: confirmationTimeFeeRateX,
        },
        yAxis: {
          type: 'value',
          name: `${i18n.t('fee_rate_tracker.fee_rate')}${isLG ? '' : '\n'}(${i18n.t(
            'fee_rate_tracker.shannons_per_byte',
          )})`,
        },
        series: [
          {
            data: confirmationTimeFeeRateY,
            type: 'bar',
            itemStyle: {
              color: 'blue',
            },
            label: {
              show: true,
              position: 'top',
              color: 'black',
              fontSize: 10,
            },
          },
        ],
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
    <ReactEchartsCore
      echarts={echarts}
      option={{
        xAxis: {
          type: 'category',
          data: feeRateTransactionCountX,
          name: `${i18n.t('fee_rate_tracker.fee_rate')} (${i18n.t('fee_rate_tracker.shannons_per_byte')})`,
          nameGap: 32,
          nameLocation: 'middle',
        },
        yAxis: {
          type: 'value',
          name: i18n.t('fee_rate_tracker.transaction_count'),
        },
        series: [
          {
            data: feeRateTransactionCountY,
            type: 'bar',
            itemStyle: {
              color: 'blue',
            },
            label: {
              show: true,
              position: 'top',
              color: 'black',
              formatter: ({ value }: { value: number }) => {
                return value === 0 ? '' : value
              },
            },
          },
        ],
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
      onEvents={{
        click: ({ name }: { name: string }) => {
          if (!name || feeRatePrecision > 3) {
            return
          }
          setFeeRateCeilFilter(new BigNumber(name))
          setFeeRatePrecision(p => p + 1)
        },
      }}
    />
  )
}

export const FeeRateTransactionCountChart = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  const { app } = useAppState()
  return useMemo(() => {
    // eslint-disable-next-line no-console
    console.log(`language changed to ${app.language}, Fee Rate of Transaction Count Chart needs to be re-rendered.`)
    return <FeeRateTransactionCountChartCore pendingTransactionFeeRates={pendingTransactionFeeRates} />
  }, [pendingTransactionFeeRates, app.language])
}

export const LastNDaysTransactionFeeRateChart = ({
  lastNDaysTransactionFeeRates,
}: {
  lastNDaysTransactionFeeRates: FeeRateTracker.LastNDaysTransactionFeeRate[]
}) => {
  const isLG = useIsLGScreen()
  const sortedLastNDaysTransactionFeeRates = [...lastNDaysTransactionFeeRates].sort((a, b) =>
    dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1,
  )

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={{
        xAxis: {
          type: 'category',
          name: `${i18n.t('fee_rate_tracker.n_days', { n: 7 })}`,
          nameGap: 32,
          nameLocation: 'middle',
          axisTick: {
            alignWithLabel: true,
          },
          data: sortedLastNDaysTransactionFeeRates.map(r => dayjs(r.date).format('YYYY-MM-DD')),
        },
        yAxis: {
          type: 'value',
          name: `${i18n.t('fee_rate_tracker.fee_rate')}${isLG ? '' : '\n'}(${i18n.t(
            'fee_rate_tracker.shannons_per_byte',
          )})`,
        },
        series: [
          {
            data: sortedLastNDaysTransactionFeeRates.map(r => Number(r.feeRate)),
            type: 'line',
            itemStyle: {
              color: 'blue',
            },
            label: {
              show: true,
              position: 'top',
              color: 'black',
              formatter: ({ value }: { value: number }) => {
                return value.toFixed(12)
              },
            },
          },
        ],
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
