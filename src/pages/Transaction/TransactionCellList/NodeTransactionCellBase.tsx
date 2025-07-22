import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  TransactionCellCardPanel,
  TransactionCellMobileItem,
  TransactionCellPanel,
  TransactionCellContentPanel,
} from '../TransactionCell/TransactionCellComp'
import { ReactComponent as DeprecatedAddrOn } from './deprecated_addr_on.svg'
import { ReactComponent as DeprecatedAddrOff } from './deprecated_addr_off.svg'
import { ReactComponent as Warning } from './warning.svg'
import styles from './styles.module.scss'
import { useIsDeprecatedAddressesDisplayed } from './useIsDeprecatedAddressesDisplayed'
import { TransactionCellList } from './TransactionCellList'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { useIsMobile } from '../../../hooks'
import Cellbase from '../../../components/Transaction/Cellbase'
import TransactionReward from '../TransactionReward'
import Loading from '../../../components/Loading'
import Tooltip from '../../../components/Tooltip'

export default ({ blockHash, blockNumber }: { blockHash?: string; blockNumber?: number }) => {
  const { t } = useTranslation()
  const { nodeService } = useCKBNode()
  const isMobile = useIsMobile()
  const { data: blockEconomic, isLoading } = useQuery(
    ['block', 'economic', blockHash],
    () => (blockHash ? nodeService.getBlockEconomicState(blockHash) : null),
    {
      enabled: Boolean(blockHash),
    },
  )

  const [isDeprecatedAddressesDisplayed, addrFormatToggleURL] = useIsDeprecatedAddressesDisplayed()

  const cellTitle = (() => {
    return (
      <div className={styles.cellListTitle}>
        {`${t('transaction.input')} (1)`}
        <Tooltip
          trigger={
            <Link className={styles.newAddrToggle} to={addrFormatToggleURL} role="presentation">
              {!isDeprecatedAddressesDisplayed ? <DeprecatedAddrOff /> : <DeprecatedAddrOn />}
            </Link>
          }
          placement="top"
        >
          {t(`address.view-deprecated-address`)}
        </Tooltip>
        {!isDeprecatedAddressesDisplayed ? null : (
          <Tooltip trigger={<Warning />} placement="top">
            {t('address.displaying-deprecated-address')}
          </Tooltip>
        )}
      </div>
    )
  })()

  const cellbaseContent = (() => {
    if (isLoading) {
      return <Loading show />
    }

    if (!blockEconomic || !blockNumber || !blockHash || blockNumber < 12) {
      return (
        <TransactionCellCardPanel>
          <TransactionCellMobileItem title={<Cellbase cell={{}} isDetail={false} />} />
        </TransactionCellCardPanel>
      )
    }

    const reward = {
      baseReward: blockEconomic.minerReward.primary,
      secondaryReward: blockEconomic.minerReward.secondary,
      commitReward: blockEconomic.minerReward.committed,
      proposalReward: blockEconomic.minerReward.proposal,
    }

    if (isMobile) {
      return (
        <TransactionCellCardPanel>
          <TransactionCellMobileItem title={<Cellbase cell={{ targetBlockNumber: blockNumber - 11 }} isDetail />} />
          <TransactionReward reward={reward} />
        </TransactionCellCardPanel>
      )
    }

    return (
      <TransactionCellPanel>
        <TransactionCellContentPanel isCellbase>
          <div className="transactionCellAddress">
            <Cellbase cell={{ targetBlockNumber: blockNumber - 11 }} isDetail />
          </div>

          <div className="transactionCellDetail">
            <TransactionReward reward={reward} />
          </div>
        </TransactionCellContentPanel>
      </TransactionCellPanel>
    )
  })()

  return (
    <TransactionCellList
      title={cellTitle}
      extra={
        <>
          <div>{t('transaction.reward_info')}</div>
        </>
      }
    >
      {cellbaseContent}
    </TransactionCellList>
  )
}
