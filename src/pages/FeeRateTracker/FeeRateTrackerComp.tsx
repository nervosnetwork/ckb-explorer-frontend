import { Col, Row } from 'antd'
import BigNumber from 'bignumber.js'
import echarts from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import styles from './styles.module.scss'
import { isScreenSmallerThan1200 } from '../../utils/screen'
import { useIsMobile } from '../../utils/hook'

export const FeeRateCards = ({ transactionFeeRates }: { transactionFeeRates: FeeRateTracker.TransactionFeeRate[] }) => {
  const feeRateCards = [
    {
      priority: 'Low',
      limitTimeDisplay: '3 mins',
      limitTimeSeconds: 180,
    },
    {
      priority: 'Average',
      limitTimeDisplay: '1 mins',
      limitTimeSeconds: 60,
    },
    {
      priority: 'High',
      limitTimeDisplay: '30 secs',
      limitTimeSeconds: 30,
    },
  ].map(c => {
    const frs = transactionFeeRates.filter(r => {
      return r.confirmationTime === 0 || (r.confirmationTime && r.confirmationTime <= c.limitTimeSeconds)
    })
    const feeRate =
      frs.length === 0
        ? 0
        : BigNumber.sum(...frs.map(r => r.feeRate))
            .div(frs.length)
            .dp(3, BigNumber.ROUND_HALF_EVEN)
            .toNumber()
    return { ...c, feeRate } as FeeRateTracker.FeeRateCard
  })

  return (
    <Row justify="space-evenly" className={styles.priceCenter}>
      {feeRateCards.map(feeRateCard => (
        <Col span={6} key={feeRateCard.limitTimeSeconds}>
          <div className={styles.card}>
            <div>{feeRateCard.priority}</div>
            <div>{feeRateCard.feeRate} shannons/byte</div>
            <div>{feeRateCard.limitTimeDisplay}</div>
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
          name: 'Confirmation Time (second)',
          nameGap: 32,
          nameLocation: 'middle',
          axisTick: {
            alignWithLabel: true,
          },
          data: confirmationTimeFeeRateX,
        },
        yAxis: {
          type: 'value',
          name: isScreenSmallerThan1200() ? 'Fee Rate\n(shannons/byte)' : 'Fee Rate (shannons/byte)',
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
  const isMobile = useIsMobile()

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
          name: 'Fee Rate (shannons/byte)',
          nameGap: 32,
          nameLocation: 'middle',
        },
        yAxis: {
          type: 'value',
          name: isMobile ? 'Transaction\nCount' : 'Transaction Count',
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
                    text: '← Back',
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
  return useMemo(
    () => <FeeRateTransactionCountChartCore pendingTransactionFeeRates={pendingTransactionFeeRates} />,
    [pendingTransactionFeeRates],
  )
}

export const LastNDaysTransactionFeeRateChart = ({
  lastNDaysTransactionFeeRates,
}: {
  lastNDaysTransactionFeeRates: FeeRateTracker.LastNDaysTransactionFeeRate[]
}) => {
  const sortedLastNDaysTransactionFeeRates = [...lastNDaysTransactionFeeRates].sort((a, b) =>
    dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1,
  )

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={{
        xAxis: {
          type: 'category',
          name: '7 Days',
          nameGap: 32,
          nameLocation: 'middle',
          axisTick: {
            alignWithLabel: true,
          },
          data: sortedLastNDaysTransactionFeeRates.map(r => dayjs(r.date).format('YYYY-MM-DD')),
        },
        yAxis: {
          type: 'value',
          name: isScreenSmallerThan1200() ? 'Fee Rate\n(shannons/byte)' : 'Fee Rate (shannons/byte)',
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
