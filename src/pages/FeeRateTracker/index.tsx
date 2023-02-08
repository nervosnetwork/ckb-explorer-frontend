import { useState } from 'react'
import { useQuery } from 'react-query'
import { Row } from 'antd'
import { v2AxiosIns } from '../../service/http/fetcher'
import styles from './styles.module.scss'
import Content from '../../components/Content'
import { toCamelcase } from '../../utils/util'
import { useAnimationFrame } from '../../utils/hook'
import {
  ConfirmationTimeFeeRateChart,
  FeeRateCards,
  FeeRateTransactionCountChart,
  LastNDaysTransactionFeeRateChart,
} from './FeeRateTrackerComp'
import Loading from '../../components/Loading'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'

const FeeRateTracker = () => {
  const [lastFetchedTime, setLastFetchedTime] = useState<number>(Number.MAX_SAFE_INTEGER)
  const [secondAfterUpdate, setSecondAfterUpdate] = useState<number>(0)

  const { data: transactionFeesStatistic } = useQuery<FeeRateTracker.TransactionFeesStatistic>(
    ['statistics-transaction_fees'],
    () =>
      v2AxiosIns.get(`statistics/transaction_fees`).then(({ status, data }) => {
        if (status === 200 && data) {
          setLastFetchedTime(Date.now())
          setSecondAfterUpdate(0)
          return toCamelcase<FeeRateTracker.TransactionFeesStatistic>(data)
        }
        return {
          transactionFeeRates: [],
          pendingTransactionFeeRates: [],
          lastNDaysTransactionFeeRates: [],
        }
      }),
    {
      refetchInterval: 1000 * 60,
    },
  )

  useAnimationFrame(() => {
    if (Date.now() - lastFetchedTime >= (secondAfterUpdate + 1) * 1000) {
      setSecondAfterUpdate(s => s + 1)
    }
  })

  return (
    <Content>
      <div className={`${styles.feeRateTrackerPanel} container`}>
        <Row className={styles.title}>{i18n.t('fee_rate_tracker.title')}</Row>
        <Row className={styles.updatedTimeCounter}>
          {i18n.t('fee_rate_tracker.updated_time', {
            second: secondAfterUpdate,
          })}
        </Row>
        {transactionFeesStatistic ? (
          <FeeRateCards transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
        ) : (
          <Loading show />
        )}
        <Row className={styles.chartTitle}>
          {i18n.t('fee_rate_tracker.confirmation_time_x_fee_rate', {
            c: localeNumberString(10000),
          })}
        </Row>
        <Row className={styles.chart}>
          {transactionFeesStatistic ? (
            <ConfirmationTimeFeeRateChart transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
          ) : (
            <Loading show />
          )}
        </Row>
        <Row className={styles.chartTitle}>{i18n.t('fee_rate_tracker.fee_rate_of_pending_transactions')}</Row>
        <Row className={styles.chart}>
          {transactionFeesStatistic ? (
            <FeeRateTransactionCountChart
              pendingTransactionFeeRates={transactionFeesStatistic.pendingTransactionFeeRates}
            />
          ) : (
            <Loading show />
          )}
        </Row>
        <Row className={styles.chartTitle}>{i18n.t('fee_rate_tracker.n_days_historical_fee_rate', { n: 7 })}</Row>
        <Row className={styles.chart}>
          {transactionFeesStatistic ? (
            <LastNDaysTransactionFeeRateChart
              lastNDaysTransactionFeeRates={transactionFeesStatistic.lastNDaysTransactionFeeRates}
            />
          ) : (
            <Loading show />
          )}
        </Row>
      </div>
    </Content>
  )
}

export default FeeRateTracker
