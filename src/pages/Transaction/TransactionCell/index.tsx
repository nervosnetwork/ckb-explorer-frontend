import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../../components/Card/OverviewCard'
import { CellState, CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { isMobile, isLargeMobile, isMediumMobile, isSmallMobile } from '../../../utils/screen'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import TransactionCellDetail from '../TransactionCellDetail'
import { AppDispatch } from '../../../contexts/providers/reducer'
import {
  TransactionCellContentPanel,
  TransactionCellDetailDataPanel,
  TransactionCellDetailLockScriptPanel,
  TransactionCellDetailPanel,
  TransactionCellDetailTypeScriptPanel,
  TransactionCellHashPanel,
  TransactionCellPanel,
} from './styled'

const handleAddressHashText = (hash: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(hash, 16)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(hash, 23)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(hash, 29)
  }
  return startEndEllipsis(hash, 24)
}

const TransactionCellHash = ({ cell }: { cell: State.InputOutput }) => {
  return (
    <TransactionCellHashPanel highLight={cell.address_hash !== null}>
      {cell.address_hash ? (
        <Link to={`/address/${cell.address_hash}`}>{handleAddressHashText(cell.address_hash)}</Link>
      ) : (
        <span>{cell.from_cellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}</span>
      )}
    </TransactionCellHashPanel>
  )
}

const TransactionCellDetailButtons = ({
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

export default ({
  cell,
  cellType,
  dispatch,
}: {
  cell: State.InputOutput
  cellType: CellType
  dispatch: AppDispatch
}) => {
  const [state, setState] = useState(CellState.NONE as CellState)

  if (isMobile()) {
    const items: OverviewItemData[] = [
      {
        title: cellType === CellType.Input ? i18n.t('transaction.input') : i18n.t('transaction.output'),
        content: <TransactionCellHash cell={cell} />,
      },
    ]
    items.push({
      title: i18n.t('transaction.capacity'),
      content: localeNumberString(shannonToCkb(cell.capacity || 0)),
    })
    return (
      <OverviewCard items={items}>
        {!cell.from_cellbase && (
          <TransactionCellDetailButtons highLight={!cell.from_cellbase} onChange={newState => setState(newState)} />
        )}
        {state !== CellState.NONE && (
          <TransactionCellDetail cell={cell} cellType={cellType} state={state} dispatch={dispatch} />
        )}
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
          <TransactionCellDetailButtons highLight={!cell.from_cellbase} onChange={newState => setState(newState)} />
        </div>
      </TransactionCellContentPanel>
      {state !== CellState.NONE && (
        <TransactionCellDetail cell={cell} cellType={cellType} state={state} dispatch={dispatch} />
      )}
    </TransactionCellPanel>
  )
}
