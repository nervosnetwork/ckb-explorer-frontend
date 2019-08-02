import React from 'react'
import { CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel } from './styled'
import { AppDispatch } from '../../../contexts/providers/reducer'

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
  const hideCapacityTitle = inputs && inputs.length > 0 && inputs[0].from_cellbase
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>{inputs ? i18n.t('transaction.input') : i18n.t('transaction.output')}</span>
          <span>{hideCapacityTitle ? '' : i18n.t('transaction.capacity')}</span>
          <span>{i18n.t('transaction.detail')}</span>
        </div>
      </TransactionCellListTitlePanel>
      {cells &&
        cells.map(cell => (
          <TransactionCell
            key={cell.id}
            cell={cell}
            cellType={inputs ? CellType.Input : CellType.Output}
            dispatch={dispatch}
          />
        ))}
    </TransactionCellListPanel>
  )
}
