import React from 'react'
import { CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel, TransactionCellsPanel } from './styled'
import { AppDispatch } from '../../../contexts/providers/reducer'

const MAX_CELL_COUNT = 200

export default ({
  inputs,
  outputs,
  dispatch,
}: {
  inputs?: State.InputOutput[]
  outputs?: State.InputOutput[]
  dispatch: AppDispatch
}) => {
  const cells = inputs || outputs || []
  const hideCapacityTitle = inputs && inputs.length > 0 && inputs[0].fromCellbase
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>{inputs ? i18n.t('transaction.input') : i18n.t('transaction.output')}</span>
          <span>{hideCapacityTitle ? '' : i18n.t('transaction.capacity')}</span>
          <span>{i18n.t('transaction.detail')}</span>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCellsPanel isScroll={cells.length >= MAX_CELL_COUNT}>
        <div className="transaction__cell_list_container">
          {cells &&
            cells.map(cell => (
              <TransactionCell
                key={cell.id}
                cell={cell}
                cellType={inputs ? CellType.Input : CellType.Output}
                dispatch={dispatch}
              />
            ))}
        </div>
      </TransactionCellsPanel>
    </TransactionCellListPanel>
  )
}
