import React from 'react'
import TransactionCellPanel from './styled'

export default () => {
  return (
    <TransactionCellPanel>
      <div className="transaction__cell_hash">Cellbase</div>
      <div className="transaction__cell_capacity">22,234.7128</div>
      <div className="transaction__cell_detail" />
    </TransactionCellPanel>
  )
}
