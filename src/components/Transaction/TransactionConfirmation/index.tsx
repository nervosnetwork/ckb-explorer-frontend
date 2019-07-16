import React from 'react'
import { TransactiomConfirmationContainer, TransactiomConfirmationContent } from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, capacity }: { confirmation?: number; capacity: number }) => {
  return (
    <TransactiomConfirmationContainer increased={capacity >= 0}>
      <div className="transaction_item__confirmation">
        <TransactiomConfirmationContent float="right">
          <div className="left" />
          <div className="value">{confirmation && formatConfirmation(confirmation)}</div>
          <div className="right" />
        </TransactiomConfirmationContent>
      </div>
      <div className="transaction_item__capacity">
        <TransactiomConfirmationContent>
          <div className="left" />
          <div className="value">
            {`${capacity >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(capacity)))} CKB`}
          </div>
          <div className="right" />
        </TransactiomConfirmationContent>
      </div>
    </TransactiomConfirmationContainer>
  )
}
