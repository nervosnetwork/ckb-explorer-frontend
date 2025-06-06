import { useTranslation } from 'react-i18next'
import { CsvExport } from '../../components/CsvExport'
import TransactionItem from '../../components/TransactionItem/index'
import styles from './styles.module.scss'
import PaginationWithRear from '../../components/PaginationWithRear'
import { Transaction } from '../../models/Transaction'
import { XUDT } from '../../models/Xudt'
import { RawBtcRPC } from '../../services/ExplorerService'

export const UDTComp = ({
  currentPage,
  pageSize,
  transactions,
  total,
  onPageChange,
  xudt,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  onPageChange: (page: number) => void
  xudt?: XUDT
  filterNoResult?: boolean
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <div className={styles.udtNoResultPanel}>
        <span>{t('search.udt_filter_no_result')}</span>
      </div>
    )
  }
  return (
    <>
      <div className={styles.udtTransactionsPanel}>
        {transactions.map(
          (transaction, index) =>
            transaction && (
              <TransactionItem
                transaction={transaction}
                key={transaction.transactionHash}
                circleCorner={{
                  bottom: index === transactions.length - 1 && totalPages === 1,
                }}
              />
            ),
        )}
      </div>
      <div className={styles.udtTransactionsPagination}>
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
          rear={xudt ? <CsvExport link={`/export-xudt-holders?id=${xudt.typeHash}`} /> : null}
        />
      </div>
    </>
  )
}

export default UDTComp
