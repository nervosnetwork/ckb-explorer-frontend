import React from 'react'
import {
  TransactiomConfirmationPanel,
  TransactionConfirmationValuePanel,
  TransactionCapacityValuePanel,
} from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, income }: { confirmation?: number; income: number }) => {
  return (
    <TransactiomConfirmationPanel>
      <div className="transaction__confirmation_content">
        <div className="transaction__confirmation">
          <TransactionConfirmationValuePanel>
            <span>{confirmation && formatConfirmation(confirmation)}</span>
          </TransactionConfirmationValuePanel>
        </div>
        <div className="transaction__capacity">
          <TransactionCapacityValuePanel increased={income >= 0}>
            <span>{`${income >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(income)))} CKB`}</span>
          </TransactionCapacityValuePanel>
        </div>
      </div>
    </TransactiomConfirmationPanel>
  )
}
