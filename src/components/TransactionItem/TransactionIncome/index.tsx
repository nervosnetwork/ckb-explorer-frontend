import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import i18n from '../../../utils/i18n'
import { TransactionIncomePanel, TransactionCapacityValuePanel } from './styled'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../DecimalCapacity'
import { useIsMobile } from '../../../utils/hook'
import CurrentAddressIcon from '../../../assets/current_address.svg'

export default ({ income }: { income: string }) => {
  const isMobile = useIsMobile()
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  return (
    <TransactionIncomePanel>
      <TransactionCapacityValuePanel increased={bigIncome.isGreaterThanOrEqualTo(0)}>
        {isMobile && (
          <Tooltip placement="top" title={`${i18n.t('address.current-address')} `}>
            <img src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
        <DecimalCapacity
          value={`${bigIncome.isPositive() ? '+' : ''}${localeNumberString(shannonToCkb(bigIncome))}`}
          color="inherit"
        />
        {!isMobile && (
          <Tooltip placement="top" title={`${i18n.t('address.current-address')} `}>
            <img src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
      </TransactionCapacityValuePanel>
    </TransactionIncomePanel>
  )
}
