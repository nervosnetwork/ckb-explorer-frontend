import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import Content from '../../components/Content'
import { useAnimationFrame, useIsMobile } from '../../hooks'
import {
  ConfirmationTimeFeeRateChart,
  FeeRateCards,
  FeeRateTransactionCountChart,
  LastNDaysTransactionFeeRateChart,
} from './FeeRateTrackerComp'
import Loading from '../../components/Loading'
import { localeNumberString } from '../../utils/number'
import { getFeeRateSamples } from '../../utils/chart'
import { explorerService, useStatistics } from '../../services/ExplorerService'
import { FeeRateTracker } from '../../services/ExplorerService/fetcher'

const FeeRateTrackerPage = () => {
  const { t } = useTranslation()
  const lastFetchedTime = useRef(Number.MAX_SAFE_INTEGER)
  const deltaSecond = useRef(0)
  const [secondAfterUpdate, setSecondAfterUpdate] = useState<number>(0)
  const isMobile = useIsMobile()

  const statistics = useStatistics()

  const { data: transactionFeesStatistic } = useQuery<FeeRateTracker.TransactionFeesStatistic>(
    ['statistics-transaction_fees'],
    async () => {
      const res = await explorerService.api.fetchStatisticTransactionFees()
      lastFetchedTime.current = Date.now()
      deltaSecond.current = 0
      // TODO: refactor to dataUpdatedAt?
      setSecondAfterUpdate(0)
      return res
    },
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
        <div className={styles.title}>{t('fee_rate_tracker.title')}</div>
        <div className={styles.charts}>
          <div className={styles.feeRateSection}>
            <div className={styles.updatedTimeCounter}>
              {t('fee_rate_tracker.updated_time', {
                second: secondAfterUpdate,
              })}
            </div>
            <div className={styles.cards}>
              {transactionFeesStatistic ? (
                <FeeRateCards
                  transactionFeeRates={getFeeRateSamples(
                    transactionFeesStatistic.transactionFeeRates,
                    Number(statistics.transactionsCountPerMinute),
                    Number(statistics.averageBlockTime) / 1000,
                  )}
                />
              ) : (
                <Loading show />
              )}
            </div>
          </div>
          <div>
            <div className={styles.chartTitle}>
              {`${t('fee_rate_tracker.confirmation_time_x_avg_fee_rate')}${isMobile ? '\n' : ' '}(${t(
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
            <div className={styles.chartTitle}>{t('fee_rate_tracker.fee_rate_of_pending_transactions')}</div>
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
          <div>
            <div className={styles.chartTitle}>{t('fee_rate_tracker.n_days_historical_fee_rate', { n: 7 })}</div>
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

export default FeeRateTrackerPage
