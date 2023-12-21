import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import type { Transaction } from '../../models/Transaction'
import { useSearchParams } from '../../hooks'
import styles from './LiteTransactionList.module.scss'
import AddressText from '../AddressText'
import { localeNumberString } from '../../utils/number'
import { useParseDate } from '../../utils/date'
import DecimalCapacity from '../DecimalCapacity'
import { shannonToCkb } from '../../utils/util'

const LiteTransactionList: React.FC<{
  address?: string
  list: Transaction[]
}> = ({ address, list }) => {
  const [t] = useTranslation()
  const [timeBase, setTimeBase] = useState(Date.now())
  const dateParser = useParseDate()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeBase(Date.now())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [setTimeBase])

  const { tx_status: txStatus } = useSearchParams('tx_status')

  const isPendingListActive = txStatus === 'pending'

  const headers = [
    t('transaction.transaction_hash'),
    isPendingListActive ? null : t('transaction.height'),
    t('transaction.time'),
    `${t('transaction.input')} & ${t('transaction.output')}`,
    address ? t('transaction.capacity_change') : null,
  ].filter(v => v)

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.length ? (
            list.map(item => {
              let timestamp = 0
              if (item.blockTimestamp) {
                timestamp = +item.blockTimestamp
              } else if (item.createTimestamp) {
                // FIXME: round the timestamp because sometimes a decimal is returned from the API, could be removed when the API is fixed
                timestamp = Math.floor(Number(item.createTimestamp))
              }

              const dateTime = new Date(timestamp).toISOString()
              const localTime = dateParser(timestamp, timeBase)

              let bigIncome = new BigNumber(item.income)
              if (bigIncome.isNaN()) {
                bigIncome = new BigNumber(0)
              }
              const isIncome = bigIncome.isGreaterThanOrEqualTo(0)
              return (
                <tr key={item.transactionHash}>
                  <td className={styles.hash} title={t('transaction.transaction_hash')}>
                    <AddressText
                      disableTooltip
                      linkProps={{
                        to: `/transaction/${item.transactionHash}`,
                      }}
                    >
                      {item.transactionHash}
                    </AddressText>
                  </td>
                  {isPendingListActive ? null : (
                    <td className={styles.height} title={t('transaction.height')}>
                      <Link className={styles.blockLink} to={`/block/${item.blockNumber}`}>
                        {localeNumberString(item.blockNumber)}
                      </Link>
                    </td>
                  )}
                  <td className={styles.time} title={t('transaction.time')}>
                    <time dateTime={dateTime}>{localTime}</time>
                  </td>
                  <td className={styles.cells} title={`${t('transaction.input')} & ${t('transaction.output')}`}>
                    {`${t('transaction.input')}: ${item.displayInputs.length}    ${t('transaction.output')}: ${
                      item.displayOutputs.length
                    }`}
                  </td>
                  {address ? (
                    <td className={styles.income} title={t('transaction.capacity_change')}>
                      <span data-is-positive={bigIncome.isPositive()} data-is-zero={bigIncome.isZero()}>
                        <DecimalCapacity
                          value={localeNumberString(shannonToCkb(bigIncome))}
                          balanceChangeType={isIncome ? 'income' : 'payment'}
                        />
                      </span>
                    </td>
                  ) : null}
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={headers.length} className={styles.noRecords}>
                {t('transaction.no_records')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LiteTransactionList
