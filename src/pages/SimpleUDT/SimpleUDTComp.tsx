import React from 'react'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel, UDTTransactionTitlePanel } from './styled'
import browserHistory from '../../routes/history'
import UDTSearch from '../../components/Search/UDTSearch'
import { isMobile } from '../../utils/screen'
import SearchLogo from '../../assets/search_black.png'
import { ComponentActions } from '../../contexts/actions'
import { parseUDTAmount } from '../../utils/number'

const simpleUDTInfo = (udt: State.UDT) => {
  const { fullName, symbol, addressesCount, decimal, totalAmount } = udt
  return [
    {
      title: i18n.t('udt.name'),
      content: fullName,
    },
    {
      title: i18n.t('udt.holder_addresses'),
      content: addressesCount,
    },
    {
      title: i18n.t('udt.symbol'),
      content: symbol,
    },
    {
      title: i18n.t('udt.decimal'),
      content: decimal,
    },
    {
      title: i18n.t('udt.total_amount'),
      content: parseUDTAmount(totalAmount, decimal),
    },
  ] as OverviewItemData[]
}

export const SimpleUDTOverview = () => {
  const {
    udtState: { udt },
  } = useAppState()
  return <OverviewCard items={simpleUDTInfo(udt)} hideShadow />
}

export const SimpleUDTComp = ({
  currentPage,
  pageSize,
  typeHash,
}: {
  currentPage: number
  pageSize: number
  typeHash: string
}) => {
  const {
    udtState: { transactions = [], total },
  } = useAppState()
  const dispatch = useDispatch()
  const {
    components: { searchBarEditable },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/sudt/${typeHash}?page=${page}&size=${pageSize}`)
  }

  const UDTTitleSearchComp = () => {
    return (
      <UDTTransactionTitlePanel>
        <div className="udt__transaction__container">
          {(!isMobile() || (isMobile() && !searchBarEditable)) && (
            <div className="udt__transaction__title">{i18n.t('transaction.transactions')}</div>
          )}
          {isMobile() && !searchBarEditable && (
            <img
              className="udt__search__icon"
              src={SearchLogo}
              alt="search icon"
              onClick={() => {
                dispatch({
                  type: ComponentActions.UpdateHeaderSearchEditable,
                  payload: {
                    searchBarEditable: true,
                  },
                })
              }}
            />
          )}
          {(!isMobile() || (isMobile() && searchBarEditable)) && <UDTSearch typeHash={typeHash} />}
        </div>
        <div className="udt__transaction__title__separate" />
      </UDTTransactionTitlePanel>
    )
  }

  return (
    <>
      <SimpleUDTTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                transaction={transaction}
                key={transaction.transactionHash}
                titleCard={index === 0 ? <UDTTitleSearchComp /> : null}
              />
            )
          )
        })}
      </SimpleUDTTransactionsPanel>
      {totalPages > 1 && (
        <SimpleUDTTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </SimpleUDTTransactionsPagination>
      )}
    </>
  )
}

export default SimpleUDTComp
