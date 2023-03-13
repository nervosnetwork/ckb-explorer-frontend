import { Link } from 'react-router-dom'
import { parseDate } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import AddressText from '../../AddressText'
import styles from './index.module.scss'
import TransactionLiteIncome from '../TransactionLiteIncome'

const TransactionLiteItem = ({ transaction, address }: { transaction: State.Transaction; address?: string }) => {
  return (
    <div className={styles.transactionLitePanel}>
      <div className={styles.transactionLiteRow}>
        <div>
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
          <Link className={styles.blockLink} to={`/block/${transaction.blockNumber}`}>
            {localeNumberString(transaction.blockNumber)}
          </Link>
        </div>
        <div>{parseDate(transaction.blockTimestamp)}</div>
        <div>
          {transaction.displayInputs && `Input: ${transaction.displayInputs.length} `}
          {transaction.displayOutputs && `Output: ${transaction.displayOutputs.length}`}
        </div>
        <div>{address && <TransactionLiteIncome income={transaction.income} />}</div>
      </div>
    </div>
  )
}

export default TransactionLiteItem
