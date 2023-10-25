import { useTranslation } from 'react-i18next'
import TransactionItem from '../../../components/TransactionItem'
import { TransactionsPagination, DAONoResultPanel } from './styled'
import Pagination from '../../../components/Pagination'
import { PageParams } from '../../../constants/common'
import { deprecatedAddrToNewAddr } from '../../../utils/util'
import { Transaction } from '../../../models/Transaction'

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
  transactions: Transaction[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <DAONoResultPanel>
        <span>{t('search.dao_filter_no_result')}</span>
      </DAONoResultPanel>
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
        (transaction: Transaction, index: number) =>
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
        <TransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </TransactionsPagination>
      )}
    </>
  )
}
