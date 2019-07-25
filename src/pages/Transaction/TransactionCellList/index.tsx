import React from 'react'
import { TransactionCellListPanel, TransactionCellListTitlePanel } from './styled'
import TransactionCell from '../TransactionCell'
import { CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'

export default ({ inputs, outputs }: { inputs?: State.InputOutput[]; outputs?: State.InputOutput[] }) => {
  const cells = inputs || outputs || []
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>{inputs ? i18n.t('transaction.input') : i18n.t('transaction.output')}</span>
          <span>{i18n.t('transaction.capacity')}</span>
          <span>{i18n.t('transaction.detail')}</span>
        </div>
      </TransactionCellListTitlePanel>
      {cells.map(cell => (
        <TransactionCell cell={cell} cellType={inputs ? CellType.Input : CellType.Output} />
      ))}
    </TransactionCellListPanel>
  )
}
