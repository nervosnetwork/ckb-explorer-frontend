import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localeNumberString } from '../../../utils/number'
import AddressText from '../../AddressText'
import styles from './index.module.scss'
import TransactionLiteIncome from '../TransactionLiteIncome'
import { useIsMobile, useParsedDate } from '../../../utils/hook'
import { Transaction } from '../../../models/Transaction'

const TransactionLiteItem = ({ transaction, address }: { transaction: Transaction; address?: string }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const parsedBlockCreateAt = useParsedDate(transaction.blockTimestamp)
  return (
    <div className={styles.transactionLitePanel}>
      <div className={styles.transactionLiteRow}>
        <div>
          {isMobile && <div>{t('transaction.transaction_hash')}</div>}
          <AddressText
            disableTooltip
            className={styles.transactionLink}
            linkProps={{
              to: `/transaction/${transaction.transactionHash}`,
            }}
          >
            {transaction.transactionHash}
          </AddressText>
        </div>
        <div>
          {isMobile && <div>{t('transaction.height')}</div>}
          <Link className={styles.blockLink} to={`/block/${transaction.blockNumber}`}>
            {localeNumberString(transaction.blockNumber)}
          </Link>
        </div>
        <div>
          {isMobile && <div>{t('transaction.time')}</div>}
          {parsedBlockCreateAt}
        </div>
        <div>
          {isMobile && <div>{`${t('transaction.input')} & ${t('transaction.output')}`}</div>}
          <span>{transaction.displayInputs && `${t('transaction.input')}: ${transaction.displayInputs.length}`}</span>
          <span>
            {transaction.displayOutputs && `${t('transaction.output')}: ${transaction.displayOutputs.length}`}
          </span>
        </div>
        <div>
          {isMobile && <div>{t('transaction.capacity_change')}</div>}
          {address && <TransactionLiteIncome income={transaction.income} />}
        </div>
      </div>
    </div>
  )
}

export default TransactionLiteItem
