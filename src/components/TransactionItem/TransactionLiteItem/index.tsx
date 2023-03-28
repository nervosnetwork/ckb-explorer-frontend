import { Link } from 'react-router-dom'
import { parseDate } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import AddressText from '../../AddressText'
import styles from './index.module.scss'
import TransactionLiteIncome from '../TransactionLiteIncome'
import i18n from '../../../utils/i18n'
import { useIsMobile } from '../../../utils/hook'

const TransactionLiteItem = ({ transaction, address }: { transaction: State.Transaction; address?: string }) => {
  const isMobile = useIsMobile()
  return (
    <div className={styles.transactionLitePanel}>
      <div className={styles.transactionLiteRow}>
        <div>
          {isMobile && <div>{i18n.t('transaction.transaction_hash')}</div>}
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
          {isMobile && <div>{i18n.t('transaction.height')}</div>}
          <Link className={styles.blockLink} to={`/block/${transaction.blockNumber}`}>
            {localeNumberString(transaction.blockNumber)}
          </Link>
        </div>
        <div>
          {isMobile && <div>{i18n.t('transaction.time')}</div>}
          {parseDate(transaction.blockTimestamp)}
        </div>
        <div>
          {isMobile && <div>{`${i18n.t('transaction.input')} & ${i18n.t('transaction.output')}`}</div>}
          <span>
            {transaction.displayInputs && `${i18n.t('transaction.input')}: ${transaction.displayInputs.length}`}
          </span>
          <span>
            {transaction.displayOutputs && `${i18n.t('transaction.output')}: ${transaction.displayOutputs.length}`}
          </span>
        </div>
        <div>
          {isMobile && <div>{i18n.t('transaction.capacity_change')}</div>}
          {address && <TransactionLiteIncome income={transaction.income} />}
        </div>
      </div>
    </div>
  )
}

export default TransactionLiteItem
