import React from 'react'
import Container from './styled'
import { shannonToCkb, formatConfirmation } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, capacity }: { confirmation?: number; capacity: number }) => {
  return (
    <Container increased={capacity >= 0}>
      <div className="transaction_item__confirmation">
        {confirmation !== undefined && formatConfirmation(confirmation)}
      </div>
      <div className="transaction_item__capacity">
        {`${capacity >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(capacity)))} CKB`}
      </div>
    </Container>
  )
}
