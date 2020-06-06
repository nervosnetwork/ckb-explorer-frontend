import React from 'react'
import BigNumber from 'bignumber.js'
import { TransactionIncomePanel, TransactionCapacityValuePanel } from './styled'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../DecimalCapacity'

export default ({ income }: { income: string }) => {
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  return (
    <TransactionIncomePanel>
      <TransactionCapacityValuePanel increased={bigIncome.isGreaterThanOrEqualTo(0)}>
        <DecimalCapacity
          value={`${bigIncome.isPositive() ? '+' : ''}${localeNumberString(shannonToCkb(bigIncome))}`}
          color="inherit"
        />
      </TransactionCapacityValuePanel>
    </TransactionIncomePanel>
  )
}
