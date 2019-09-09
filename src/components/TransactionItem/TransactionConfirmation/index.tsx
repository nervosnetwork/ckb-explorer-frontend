import React from 'react'
import BigNumber from 'bignumber.js'
import {
  TransactionConfirmationPanel,
  TransactionConfirmationValuePanel,
  TransactionCapacityValuePanel,
} from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, income }: { confirmation?: number; income: string }) => {
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  return (
    <TransactionConfirmationPanel>
      <div className="transaction__confirmation_content">
        <div className="transaction__confirmation">
          <TransactionConfirmationValuePanel>
            <span>{confirmation && formatConfirmation(confirmation)}</span>
          </TransactionConfirmationValuePanel>
        </div>
        <div className="transaction__capacity">
          <TransactionCapacityValuePanel increased={bigIncome.isGreaterThanOrEqualTo(0)}>
            <span>{`${bigIncome.isNegative() ? '-' : '+'} ${localeNumberString(shannonToCkb(bigIncome))} CKB`}</span>
          </TransactionCapacityValuePanel>
        </div>
      </div>
    </TransactionConfirmationPanel>
  )
}
