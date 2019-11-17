import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../../components/Card/OverviewCard'
import { CellState, CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import TransactionCellDetail from '../TransactionCellScript'
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
import TransactionCellArrow from '../TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'

const handleAddressHashText = (hash: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(hash, 11)
  }
  return adaptPCEllipsis(hash, 8, 50)
}

const TransactionCellHash = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  return (
    <TransactionCellHashPanel highLight={cell.addressHash !== null}>
      {!cell.fromCellbase && cellType === CellType.Input && (
        <TransactionCellArrow cell={cell} cellType={cellType} haveMarginTop />
      )}
      {cell.addressHash ? (
        <Link to={`/address/${cell.addressHash}`}>
          <span className="address">{handleAddressHashText(cell.addressHash)}</span>
        </Link>
      ) : (
        <span>{cell.fromCellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}</span>
      )}
      {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} haveMarginTop />}
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
  index,
}: {
  cell: State.Cell
  cellType: CellType
  dispatch: AppDispatch
  index: number
}) => {
  const [state, setState] = useState(CellState.NONE as CellState)

  if (isMobile()) {
    const items: OverviewItemData[] = [
      {
        title: cellType === CellType.Input ? i18n.t('transaction.input') : i18n.t('transaction.output'),
        content: <TransactionCellHash cell={cell} cellType={cellType} />,
      },
    ]
    if (cell.capacity) {
      items.push({
        title: i18n.t('transaction.capacity'),
        content: <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} hideUnit />,
      })
    }
    return (
      <OverviewCard items={items}>
        {!cell.fromCellbase && (
          <TransactionCellDetailButtons highLight={!cell.fromCellbase} onChange={newState => setState(newState)} />
        )}
        {state !== CellState.NONE && (
          <TransactionCellDetail cell={cell} state={state} dispatch={dispatch} setState={setState} />
        )}
      </OverviewCard>
    )
  }

  return (
    <TransactionCellPanel>
      <TransactionCellContentPanel>
        <div className="transaction__cell_index">{cellType && cellType === CellType.Output ? `#${index}` : ' '}</div>
        <div className="transaction__cell_hash">
          <TransactionCellHash cell={cell} cellType={cellType} />
        </div>

        <div className="transaction__cell_capacity">
          {cell.capacity && <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} hideUnit />}
        </div>

        <div className="transaction__cell_detail">
          <TransactionCellDetailButtons highLight={!cell.fromCellbase} onChange={newState => setState(newState)} />
        </div>
      </TransactionCellContentPanel>
      {state !== CellState.NONE && (
        <TransactionCellDetail cell={cell} state={state} dispatch={dispatch} setState={setState} />
      )}
    </TransactionCellPanel>
  )
}
