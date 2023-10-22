import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TransactionCellListPanel from './styled'

const MAX_CELL_SHOW_SIZE = 10

export default ({
  cells,
  transaction,
  render,
}: {
  cells: State.Cell[]
  transaction: State.Transaction
  render: (cell: State.Cell) => ReactNode
}) => {
  const { t } = useTranslation()
  return (
    <TransactionCellListPanel>
      {cells && cells.map((cell, index) => index < MAX_CELL_SHOW_SIZE && render(cell))}
      {cells && cells.length >= MAX_CELL_SHOW_SIZE && (
        <div className="transactionItemViewAll">
          <Link to={`/transaction/${transaction.transactionHash}`}>{t('common.view_all')}</Link>
        </div>
      )}
    </TransactionCellListPanel>
  )
}
