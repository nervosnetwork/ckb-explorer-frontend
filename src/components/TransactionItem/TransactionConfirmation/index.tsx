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
  const bigIncome = new BigNumber(income)
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
            <span>
              {`${bigIncome.isGreaterThanOrEqualTo(0) ? '+' : '-'} ${localeNumberString(
                shannonToCkb(bigIncome.abs()),
              )} CKB`}
            </span>
          </TransactionCapacityValuePanel>
        </div>
      </div>
    </TransactionConfirmationPanel>
  )
}
