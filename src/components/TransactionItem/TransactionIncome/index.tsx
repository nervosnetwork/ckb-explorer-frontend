import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { TransactionIncomePanel, TransactionCapacityValuePanel } from './styled'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../DecimalCapacity'
import { useIsMobile } from '../../../hooks'
import CurrentAddressIcon from '../../../assets/current_address.svg'

export default ({ income }: { income: string }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  const isIncome = bigIncome.isGreaterThanOrEqualTo(0)
  return (
    <TransactionIncomePanel>
      <TransactionCapacityValuePanel increased={isIncome}>
        {isMobile && (
          <Tooltip placement="top" title={`${t('address.current-address')} `}>
            <img src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
        <DecimalCapacity
          value={`${bigIncome.isPositive() ? '+' : ''}${localeNumberString(shannonToCkb(bigIncome))}`}
          balanceChangeType={isIncome ? 'income' : 'payment'}
        />
        {!isMobile && (
          <Tooltip placement="top" title={`${t('address.current-address')} `}>
            <img src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
      </TransactionCapacityValuePanel>
    </TransactionIncomePanel>
  )
}
