import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import TransactionCellListPanel from './styled'
import { Cell } from '../../../models/Cell'
import { Transaction } from '../../../models/Transaction'

const MAX_CELL_SHOW_SIZE = 10

export default ({
  cells,
  transaction,
  render,
}: {
  cells: Cell[]
  transaction: Transaction
  render: (cell: Cell) => ReactNode
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
