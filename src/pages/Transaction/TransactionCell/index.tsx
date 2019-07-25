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
import TransactionDetail from '../TransactionCellDetail'
import { CellType, CellState } from '../../../utils/const'
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
  onChange: (type: CellState) => void
}) => {
  const [state, setState] = useState(CellState.NONE as CellState)
  const changeType = (newState: CellState) => {
    if (!highLight) return
    setState(state !== newState ? newState : CellState.NONE)
    onChange(state !== newState ? newState : CellState.NONE)
  }
  return (
    <TransactionCellDetailPanel>
      <div className="transaction__cell_lock_script">
        <TransactionCellDetailLockScriptPanel
          highLight={highLight}
          selected={state === CellState.LOCK}
          onClick={() => changeType(CellState.LOCK)}
        >
          {i18n.t('transaction.lock_script')}
        </TransactionCellDetailLockScriptPanel>
      </div>
      <div className="transaction__cell_type_script">
        <TransactionCellDetailTypeScriptPanel
          highLight={highLight}
          selected={state === CellState.TYPE}
          onClick={() => changeType(CellState.TYPE)}
        >
          {i18n.t('transaction.type_script')}
        </TransactionCellDetailTypeScriptPanel>
      </div>
      <div className="transaction__cell_data">
        <TransactionCellDetailDataPanel
          highLight={highLight}
          selected={state === CellState.DATA}
          onClick={() => changeType(CellState.DATA)}
        >
          {i18n.t('transaction.data')}
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
  const [state, setState] = useState(CellState.NONE as CellState)

  if (isMobile()) {
    const items: OverviewItemData[] = [
      {
        title: cellType === CellType.Input ? i18n.t('transaction.input') : i18n.t('transaction.output'),
        content: <TransactionCellHash cell={cell} />,
      },
    ]
    if (cell.capacity) {
      items.push({
        title: i18n.t('transaction.capacity'),
        content: cell.capacity && localeNumberString(shannonToCkb(cell.capacity)),
      })
    }
    return (
      <OverviewCard items={items}>
        {highLight && <TransactionCellDetail highLight={highLight} onChange={newState => setState(newState)} />}
        {state !== CellState.NONE && <TransactionDetail cell={cell} cellType={cellType} state={state} />}
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
          <TransactionCellDetail highLight={highLight} onChange={newState => setState(newState)} />
        </div>
      </TransactionCellContentPanel>
      {state !== CellState.NONE && <TransactionDetail cell={cell} cellType={cellType} state={state} />}
    </TransactionCellPanel>
  )
}
