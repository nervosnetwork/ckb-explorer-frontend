import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { shannonToCkb } from '../../../utils/util'
import Capacity from '../../Capacity'
import { useIsMobile } from '../../../hooks'
import CurrentAddressIcon from '../../../assets/current_address.svg'
import Tooltip from '../../Tooltip'
import styles from './index.module.scss'

export default ({ income }: { income: string }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  const isIncome = bigIncome.isGreaterThanOrEqualTo(0)
  return (
    <div className={styles.transactionIncomePanel}>
      <div className={classNames(styles.transactionCapacityValuePanel, isIncome && styles.increased)}>
        {isMobile && (
          <Tooltip trigger={<img src={CurrentAddressIcon} alt="current Address" />} placement="top">
            {`${t('address.current-address')} `}
          </Tooltip>
        )}
        <Capacity capacity={shannonToCkb(bigIncome)} type="diff" />
        {!isMobile && (
          <Tooltip trigger={<img src={CurrentAddressIcon} alt="current Address" />} placement="top">
            {`${t('address.current-address')} `}
          </Tooltip>
        )}
      </div>
    </div>
  )
}
