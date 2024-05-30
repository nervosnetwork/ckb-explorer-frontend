import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CellType } from '../../../constants/common'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel, TransactionCellsPanel } from './styled'
import { ReactComponent as DeprecatedAddrOn } from './deprecated_addr_on.svg'
import { ReactComponent as DeprecatedAddrOff } from './deprecated_addr_off.svg'
import { ReactComponent as Warning } from './warning.svg'
import styles from './styles.module.scss'
import { Cell } from '../../../models/Cell'
import { useSearchParams, useUpdateSearchParams } from '../../../hooks'

function useIsDeprecatedAddressesDisplayed() {
  const { addr_format } = useSearchParams('addr_format')
  const updateSearchParams = useUpdateSearchParams<'addr_format'>()

  const isDeprecatedAddressesDisplayed = addr_format === 'deprecated'
  const addrFormatToggleURL = updateSearchParams(
    params => ({
      ...params,
      addr_format: isDeprecatedAddressesDisplayed ? null : 'deprecated',
    }),
    false,
    false,
  )

  return [isDeprecatedAddressesDisplayed, addrFormatToggleURL] as const
}

export default ({
  total,
  inputs,
  outputs,
  txHash,
  showReward,
  startIndex,
}: {
  total?: number
  inputs?: Cell[]
  outputs?: Cell[]
  txHash?: string
  showReward?: boolean
  startIndex: number
}) => {
  const { t } = useTranslation()
  const cells = inputs || outputs || []
  const isCellbaseInput = inputs && inputs.length > 0 && inputs[0].fromCellbase

  const [isDeprecatedAddressesDisplayed, addrFormatToggleURL] = useIsDeprecatedAddressesDisplayed()

  const cellTitle = () => {
    const title = inputs ? t('transaction.input') : t('transaction.output')
    return (
      <div className={styles.cellListTitle}>
        {`${title} (${total ?? '-'})`}
        <Tooltip placement="top" title={t(`address.view-deprecated-address`)}>
          <Link className={styles.newAddrToggle} to={addrFormatToggleURL} role="presentation">
            {!isDeprecatedAddressesDisplayed ? <DeprecatedAddrOff /> : <DeprecatedAddrOn />}
          </Link>
        </Tooltip>
        {!isDeprecatedAddressesDisplayed ? null : (
          <Tooltip placement="top" title={t('address.displaying-deprecated-address')}>
            <Warning />
          </Tooltip>
        )}
      </div>
    )
  }
  if (!cells.length) {
    return (
      <TransactionCellListPanel>
        <TransactionCellListTitlePanel>
          <div className="transactionCellListTitles">
            <div>{cellTitle()}</div>
            <div>{isCellbaseInput ? t('transaction.reward_info') : t('transaction.detail')}</div>
            <div>{isCellbaseInput ? '' : t('transaction.capacity_amount')}</div>
          </div>
        </TransactionCellListTitlePanel>
        <div className={styles.dataBeingProcessed}>{t('transaction.data-being-processed')}</div>
      </TransactionCellListPanel>
    )
  }

  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transactionCellListTitles">
          <div>{cellTitle()}</div>
          <div>{isCellbaseInput ? t('transaction.reward_info') : t('transaction.detail')}</div>
          <div>{isCellbaseInput ? '' : t('transaction.capacity_amount')}</div>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCellsPanel>
        <div className="transactionCellTitle">{cellTitle()}</div>
        <div className="transactionCellListContainer">
          {cells?.map((cell, index) => (
            <TransactionCell
              key={cell.id}
              cell={cell}
              cellType={inputs ? CellType.Input : CellType.Output}
              index={index + startIndex}
              txHash={txHash}
              showReward={showReward}
              isAddrNew={!isDeprecatedAddressesDisplayed}
            />
          ))}
        </div>
      </TransactionCellsPanel>
    </TransactionCellListPanel>
  )
}
