import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import TransactionCellListPanel from './styled'
import i18n from '../../../utils/i18n'

const MAX_CELL_SHOW_SIZE = 10

export default ({
  cells,
  transaction,
  render,
}: {
  cells: State.Cell[]
  transaction: State.Transaction
  render: (cell: State.Cell) => ReactNode
}) => (
  <TransactionCellListPanel>
    {cells && cells.map((cell, index) => index < MAX_CELL_SHOW_SIZE && render(cell))}
    {cells && cells.length >= MAX_CELL_SHOW_SIZE && (
      <div className="transactionItemViewAll">
        <Link to={`/transaction/${transaction.transactionHash}`}>{i18n.t('common.view_all')}</Link>
      </div>
    )}
  </TransactionCellListPanel>
)
