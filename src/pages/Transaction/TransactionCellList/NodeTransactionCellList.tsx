import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Cell } from '@ckb-lumos/base'
import { IOType } from '../../../constants/common'
import NodeTransactionCell from '../TransactionCell/NodeTransactionCell'
import { ReactComponent as DeprecatedAddrOn } from './deprecated_addr_on.svg'
import { ReactComponent as DeprecatedAddrOff } from './deprecated_addr_off.svg'
import { ReactComponent as Warning } from './warning.svg'
import { TransactionCellList } from './TransactionCellList'
import styles from './styles.module.scss'
import { useIsDeprecatedAddressesDisplayed } from './useIsDeprecatedAddressesDisplayed'

export default ({ cells = [], ioType }: { cells?: Cell[]; ioType: IOType }) => {
  const { t } = useTranslation()

  const [isDeprecatedAddressesDisplayed, addrFormatToggleURL] = useIsDeprecatedAddressesDisplayed()

  const cellTitle = (() => {
    const title = ioType === IOType.Input ? t('transaction.input') : t('transaction.output')
    return (
      <div className={styles.cellListTitle}>
        {`${title} (${cells.length ?? '-'})`}
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
  })()

  return (
    <TransactionCellList
      title={cellTitle}
      extra={
        <>
          <div>{t('transaction.detail')}</div>
          <div>{t('transaction.capacity_amount')}</div>
        </>
      }
    >
      {!cells.length ? (
        <div className={styles.dataBeingProcessed}>{t('transaction.data-being-processed')}</div>
      ) : (
        cells?.map((cell, index) => (
          <NodeTransactionCell
            key={`${cell.outPoint?.txHash}#${cell.outPoint?.index}`}
            cell={cell}
            ioType={ioType}
            index={index}
            isAddrNew={!isDeprecatedAddressesDisplayed}
          />
        ))
      )}
    </TransactionCellList>
  )
}
