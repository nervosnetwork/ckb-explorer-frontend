import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../DecimalCapacity'
import styles from './index.module.scss'

export default ({ income }: { income: string }) => {
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  const isIncome = bigIncome.isGreaterThanOrEqualTo(0)
  return (
    <div className={classNames(styles.transactionLitePanel, isIncome ? styles.increased : styles.decreased)}>
      <DecimalCapacity
        value={`${bigIncome.isPositive() ? '+' : ''}${localeNumberString(shannonToCkb(bigIncome))}`}
        marginBottom="0"
        balanceChangeType={isIncome ? 'income' : 'payment'}
      />
    </div>
  )
}
