import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TransactionCellPanel,
  TransactionCellContentPanel,
  TransactionCellDetailDataPanel,
  TransactionCellDetailTypeScriptPanel,
  TransactionCellDetailLockScriptPanel,
  TransactionCellHashPanel,
  TransactionCellDetailPanel,
} from './styled'
import TransactionDetail, { TransactionDetailType, CellType } from '../TransactionDetail'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkb } from '../../../utils/util'
import { startEndEllipsis } from '../../../utils/string'
import { isMobile } from '../../../utils/screen'
import OverviewCard, { OverviewItemData } from '../../../components/Card/OverviewCard'

const TransactionCellHash = ({ cell }: { cell: State.InputOutput }) => {
  return (
    <TransactionCellHashPanel highLight={cell.address_hash !== null}>
      {cell.address_hash ? (
        <Link to={`/address/${cell.address_hash}`}>{startEndEllipsis(cell.address_hash, 18)}</Link>
      ) : (
        <span>{cell.from_cellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}</span>
      )}
    </TransactionCellHashPanel>
  )
}

export const TransactionCellDetail = ({
  highLight,
  onChange,
}: {
  highLight: boolean
  onChange: (type: TransactionDetailType | undefined) => void
}) => {
  const [type, setType] = useState(undefined as TransactionDetailType | undefined)
  const changeType = (newType: TransactionDetailType) => {
    if (!highLight) return
    setType(type !== newType ? newType : undefined)
    onChange(type !== newType ? newType : undefined)
  }
  return (
    <TransactionCellDetailPanel>
      <div className="transaction__cell_lock_script">
        <TransactionCellDetailLockScriptPanel
          highLight={highLight}
          selected={type === TransactionDetailType.lockScript}
          onClick={() => changeType(TransactionDetailType.lockScript)}
        >
          {'Lock Script'}
        </TransactionCellDetailLockScriptPanel>
      </div>
      <div className="transaction__cell_type_script">
        <TransactionCellDetailTypeScriptPanel
          highLight={highLight}
          selected={type === TransactionDetailType.typeScript}
          onClick={() => changeType(TransactionDetailType.typeScript)}
        >
          {'TypeScript'}
        </TransactionCellDetailTypeScriptPanel>
      </div>
      <div className="transaction__cell_data">
        <TransactionCellDetailDataPanel
          highLight={highLight}
          selected={type === TransactionDetailType.data}
          onClick={() => changeType(TransactionDetailType.data)}
        >
          {'Data'}
        </TransactionCellDetailDataPanel>
      </div>
    </TransactionCellDetailPanel>
  )
}

export default ({ cell, cellType }: { cell: State.InputOutput; cellType: CellType }) => {
  let highLight = false
  if (cell.address_hash && cell.address_hash.length > 0) {
    highLight = true
  }
  const [detailType, setDetailType] = useState(undefined as TransactionDetailType | undefined)

  if (isMobile()) {
    const items: OverviewItemData[] = [
      {
        title: cellType === CellType.Input ? 'Input' : 'Output',
        content: <TransactionCellHash cell={cell} />,
      },
    ]
    if (cell.capacity) {
      items.push({
        title: 'Capacity',
        content: cell.capacity && localeNumberString(shannonToCkb(cell.capacity)),
      })
    }
    return (
      <OverviewCard items={items}>
        {highLight && <TransactionCellDetail highLight={highLight} onChange={type => setDetailType(type)} />}
        {detailType !== undefined && <TransactionDetail cell={cell} cellType={cellType} detailType={detailType} />}
      </OverviewCard>
    )
  }

  return (
    <TransactionCellPanel>
      <TransactionCellContentPanel>
        <div className="transaction__cell_hash">
          <TransactionCellHash cell={cell} />
        </div>
        <div className="transaction__cell_capacity">
          {cell.capacity && localeNumberString(shannonToCkb(cell.capacity))}
        </div>
        <div className="transaction__cell_detail">
          <TransactionCellDetail highLight={highLight} onChange={type => setDetailType(type)} />
        </div>
      </TransactionCellContentPanel>
      {detailType && <TransactionDetail cell={cell} cellType={cellType} detailType={detailType} />}
    </TransactionCellPanel>
  )
}
