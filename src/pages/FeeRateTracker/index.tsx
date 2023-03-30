import { useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { v2AxiosIns } from '../../service/http/fetcher'
import styles from './styles.module.scss'
import Content from '../../components/Content'
import { toCamelcase } from '../../utils/util'
import { useAnimationFrame, useIsMobile } from '../../utils/hook'
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
  const lastFetchedTime = useRef(Number.MAX_SAFE_INTEGER)
  const deltaSecond = useRef(0)
  const [secondAfterUpdate, setSecondAfterUpdate] = useState<number>(0)
  const isMobile = useIsMobile()

  const { data: transactionFeesStatistic } = useQuery<FeeRateTracker.TransactionFeesStatistic>(
    ['statistics-transaction_fees'],
    () =>
      v2AxiosIns.get(`statistics/transaction_fees`).then(({ status, data }) => {
        if (status === 200 && data) {
          lastFetchedTime.current = Date.now()
          deltaSecond.current = 0
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
    const deltaTime = Date.now() - lastFetchedTime.current
    if (deltaTime >= (deltaSecond.current + 1) * 1000) {
      setSecondAfterUpdate((deltaSecond.current = Math.floor(deltaTime / 1000)))
    }
  })

  return (
    <Content>
      <div className={`${styles.feeRateTrackerPanel} container`}>
        <div className={styles.title}>{i18n.t('fee_rate_tracker.title')}</div>
        <div className={styles.charts}>
          <div className={styles.feeRateSection}>
            <div className={styles.updatedTimeCounter}>
              {i18n.t('fee_rate_tracker.updated_time', {
                second: secondAfterUpdate,
              })}
            </div>
            <div className={styles.cards}>
              {transactionFeesStatistic ? (
                <FeeRateCards transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
              ) : (
                <Loading show />
              )}
            </div>
          </div>
          <div>
            <div className={styles.chartTitle}>
              {`${i18n.t('fee_rate_tracker.confirmation_time_x_avg_fee_rate')}${isMobile ? '\n' : ' '}(${i18n.t(
                'fee_rate_tracker.last_n_transactions',
                {
                  c: localeNumberString(10000),
                },
              )})`}
            </div>
            <div className={styles.chart}>
              {transactionFeesStatistic ? (
                <ConfirmationTimeFeeRateChart transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
              ) : (
                <Loading show />
              )}
            </div>
          </div>
          <div>
            <div className={styles.chartTitle}>{i18n.t('fee_rate_tracker.fee_rate_of_pending_transactions')}</div>
            <div className={styles.chart}>
              {transactionFeesStatistic?.pendingTransactionFeeRates ? (
                <FeeRateTransactionCountChart
                  pendingTransactionFeeRates={transactionFeesStatistic.pendingTransactionFeeRates}
                />
              ) : (
                <Loading show />
              )}
            </div>
          </div>
          <div style={{ display: 'none' }}>
            <div className={styles.chartTitle}>{i18n.t('fee_rate_tracker.n_days_historical_fee_rate', { n: 7 })}</div>
            <div className={styles.chart}>
              {transactionFeesStatistic?.lastNDaysTransactionFeeRates ? (
                <LastNDaysTransactionFeeRateChart
                  lastNDaysTransactionFeeRates={transactionFeesStatistic.lastNDaysTransactionFeeRates}
                />
              ) : (
                <Loading show />
              )}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default FeeRateTracker
