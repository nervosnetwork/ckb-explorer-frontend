import React from 'react'
import Container from './styled'
import { formattorConfirmation, shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'

export default ({ confirmation, capacity }: { confirmation?: number; capacity: number }) => {
  return (
    <Container increased={false}>
      {confirmation !== undefined && <div className="confirmation">{formattorConfirmation(confirmation)}</div>}
      <div className="capacity">
        {`${capacity >= 0 ? '+' : '-'} ${localeNumberString(shannonToCkb(Math.abs(capacity)))} CKB`}
      </div>
    </Container>
  )
}
