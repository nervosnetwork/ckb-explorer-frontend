import React from 'react'
import { TransactionCellListPanel, TransactionCellListTitlePanel } from './styled'
import TransactionCell from '../TransactionCell'

export default () => {
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>Input</span>
          <span>Capacity</span>
          <span>Detail</span>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCell />
    </TransactionCellListPanel>
  )
}
