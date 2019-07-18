import React from 'react'
import {
  TransactiomConfirmationPanel,
  TransactionConfirmationValuePanel,
  TransactionCapacityValuePanel,
} from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, capacity }: { confirmation?: number; capacity: number }) => {
  return (
    <TransactiomConfirmationPanel>
      <div className="transaction__confirmation_content">
        <div className="transaction__confirmation">
          <TransactionConfirmationValuePanel>
            <span>{confirmation && formatConfirmation(confirmation)}</span>
          </TransactionConfirmationValuePanel>
        </div>
        <div className="transaction__capacity">
          <TransactionCapacityValuePanel increased={capacity >= 0}>
            <div className="transaction__capacity_value">
              <span>{`${capacity >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(capacity)))} CKB`}</span>
            </div>
          </TransactionCapacityValuePanel>
        </div>
      </div>
    </TransactiomConfirmationPanel>
  )
}
