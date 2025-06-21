import { useTranslation } from 'react-i18next'
import TransactionItem from '../../../components/TransactionItem'
import { CsvExport } from '../../../components/CsvExport'
import PaginationWithRear from '../../../components/PaginationWithRear'
import { PageParams } from '../../../constants/common'
import { deprecatedAddrToNewAddr } from '../../../utils/util'
import { Transaction } from '../../../models/Transaction'
import { RawBtcRPC } from '../../../services/ExplorerService'
import styles from './index.module.scss'

export default ({
  currentPage = 1,
  pageSize = PageParams.PageSize,
  transactions,
  total,
  onPageChange,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <div className={styles.daoNoResultPanel}>
        <span>{t('search.dao_filter_no_result')}</span>
      </div>
    )
  }
  const txList = transactions.map(tx => ({
    ...tx,
    displayInputs: tx.displayInputs.map(i => ({
      ...i,
      addressHash: deprecatedAddrToNewAddr(i.addressHash),
    })),
    displayOutputs: tx.displayOutputs.map(o => ({
      ...o,
      addressHash: deprecatedAddrToNewAddr(o.addressHash),
    })),
  }))

  return (
    <>
      {txList.map(
        (transaction, index) =>
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              transaction={transaction}
              circleCorner={{
                bottom: index === txList.length - 1 && totalPages === 1,
              }}
            />
          ),
      )}
      {totalPages > 1 && (
        <div className={styles.transactionsPagination}>
          <PaginationWithRear
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={onPageChange}
            rear={<CsvExport link="/nervosdao/transaction/export" />}
          />
        </div>
      )}
    </>
  )
}
