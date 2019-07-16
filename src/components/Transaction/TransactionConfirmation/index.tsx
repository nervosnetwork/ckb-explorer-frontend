import React from 'react'
import TransactiomConfirmationContainer from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, capacity }: { confirmation?: number; capacity: number }) => {
  return (
    <TransactiomConfirmationContainer increased={capacity >= 0}>
      <div className="transaction_item__confirmation">
        <div className="transaction_item__confirmation_right" />
        <div className="transaction_item__confirmation_value">
          <span>{confirmation && formatConfirmation(confirmation)}</span>
        </div>
        <div className="transaction_item__confirmation_left" />
      </div>
      <div className="transaction_item__capacity">
        <div className="transaction_item__capacity_left" />
        <div className="transaction_item__capacity_value">
          <span>{`${capacity >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(capacity)))} CKB`}</span>
        </div>
        <div className="transaction_item__capacity_right" />
      </div>
    </TransactiomConfirmationContainer>
  )
}
