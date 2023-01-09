import { useState } from 'react'
import { useQuery } from 'react-query'
import { Row } from 'antd'
import { v2AxiosIns } from '../../service/http/fetcher'
import styles from './styles.module.scss'
import Content from '../../components/Content'
import { toCamelcase } from '../../utils/util'
import { useInterval } from '../../utils/hook'
import {
  ConfirmationTimeFeeRateChart,
  FeeRateCards,
  FeeRateTransactionCountChart,
  LastNDaysTransactionFeeRateChart,
} from './FeeRateTrackerComp'
import Loading from '../../components/Loading'

const FeeRateTracker = () => {
  const [fetchedTimeCounter, setFetchedTimeCounter] = useState<number>(0)

  const { data: transactionFeesStatistic } = useQuery<FeeRateTracker.TransactionFeesStatistic>(
    ['statistics-transaction_fees'],
    () =>
      v2AxiosIns.get(`statistics/transaction_fees`).then(({ status, data }) => {
        if (status === 200 && data) {
          setFetchedTimeCounter(0)
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

  useInterval(() => {
    setFetchedTimeCounter(c => c + 1)
  }, 1000)

  return (
    <Content>
      <div className={`${styles.feeRateTrackerPanel} container`}>
        <Row className={styles.title}>Fee Rate Tracker</Row>
        <Row className={styles.updatedTimeCounter}>Updated {fetchedTimeCounter}s ago</Row>
        {transactionFeesStatistic ? (
          <FeeRateCards transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
        ) : (
          <Loading show />
        )}
        <Row className={styles.chartTitle}>Confirmation Time x Fee Rate (Last 10000 transactions)</Row>
        <Row className={styles.chart}>
          {transactionFeesStatistic ? (
            <ConfirmationTimeFeeRateChart transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
          ) : (
            <Loading show />
          )}
        </Row>
        <Row className={styles.chartTitle}>Fee Rate of Pending Transactions</Row>
        <Row className={styles.chart}>
          {transactionFeesStatistic ? (
            <FeeRateTransactionCountChart
              pendingTransactionFeeRates={transactionFeesStatistic.pendingTransactionFeeRates}
            />
          ) : (
            <Loading show />
          )}
        </Row>
        <Row className={styles.chartTitle}>7 Days Historical Fee Rate</Row>
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
