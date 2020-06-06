import React, { useEffect, useMemo } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import { TableTitleRow, TableContentRow } from '../../components/Table/styled'
import { TableTitleItem, TableContentItem } from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber, adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { ListPageParams } from '../../utils/const'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useDispatch, useAppState } from '../../contexts/providers'
import DecimalCapacity from '../../components/DecimalCapacity'
import { getTransactions } from '../../service/app/transaction'
import { TransactionCapacityPanel, TransactionListPanel, ContentTable, HighLightValue } from './styled'

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
}

const TransactionValueItem = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightValue>
      <Link to={to}>
        {' '}
        <span>{value}</span>
      </Link>
    </HighLightValue>
  )
}

const getTableContentTxList = (transaction: State.Transaction) => {
  const transactionCapacity = (
    <TransactionCapacityPanel>
      <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
    </TransactionCapacityPanel>
  )

  return [
    {
      width: '40%',
      to: `/transaction/${transaction.transactionHash}`,
      content: adaptPCEllipsis(transaction.transactionHash),
    },
    {
      width: '15%',
      to: `/block/${transaction.blockNumber}`,
      content: localeNumberString(transaction.blockNumber),
    },
    {
      width: '30%',
      content: transactionCapacity,
    },
    {
      width: '15%',
      content: parseSimpleDate(transaction.blockTimestamp),
    },
  ] as TableContentData[]
}

const TransactionCardItems = (transaction: State.Transaction) => {
  const transactionCapacity = (
    <TransactionCapacityPanel>
      <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
    </TransactionCapacityPanel>
  )
  return [
    {
      title: i18n.t('transaction.transaction_hash'),
      content: (
        <TransactionValueItem
          value={adaptMobileEllipsis(transaction.transactionHash, 12)}
          to={`/transaction/${transaction.transactionHash}`}
        />
      ),
    },
    {
      title: i18n.t('transaction.height'),
      content: (
        <TransactionValueItem
          value={localeNumberString(transaction.blockNumber)}
          to={`/block/${transaction.blockNumber}`}
        />
      ),
    },
    {
      title: i18n.t('transaction.capacity'),
      content: transactionCapacity,
    },
    {
      title: i18n.t('transaction.time'),
      content: parseSimpleDate(transaction.blockTimestamp),
    },
  ] as OverviewItemData[]
}

export default () => {
  const dispatch = useDispatch()
  const { replace, push } = useHistory()
  const { search } = useLocation()

  const [t] = useTranslation()
  const TableTitles = useMemo(() => {
    return [
      {
        title: t('transaction.transaction_hash'),
        width: '40%',
      },
      {
        title: t('transaction.height'),
        width: '15%',
      },
      {
        title: t('transaction.capacity'),
        width: '30%',
      },
      {
        title: t('transaction.time'),
        width: '15%',
      },
    ]
  }, [t])

  const parsed = queryString.parse(search)
  const { transactionsState } = useAppState()
  const { transactions = [], total } = transactionsState

  const currentPage = parsePageNumber(parsed.page, ListPageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, ListPageParams.PageSize)
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    if (pageSize > ListPageParams.MaxPageSize) {
      replace(`/transaction/list?page=${currentPage}&size=${ListPageParams.MaxPageSize}`)
    }
    getTransactions(currentPage, pageSize, dispatch)
  }, [replace, currentPage, pageSize, dispatch])

  const onChange = (page: number) => {
    push(`/transaction/list?page=${page}&size=${pageSize}`)
  }

  return (
    <Content>
      <TransactionListPanel className="container">
        <div className="transaction__green__background" />
        {isMobile() ? (
          <ContentTable>
            <div className="transaction__panel">
              {transactions.map((transaction: State.Transaction) => {
                return <OverviewCard key={transaction.transactionHash} items={TransactionCardItems(transaction)} />
              })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} key={data.title} />
              })}
            </TableTitleRow>
            {transactions.map((transaction: State.Transaction) => {
              return (
                transaction && (
                  <TableContentRow key={transaction.transactionHash}>
                    {getTableContentTxList(transaction).map((data: TableContentData, index: number) => {
                      const key = index
                      return <TableContentItem width={data.width} content={data.content} to={data.to} key={key} />
                    })}
                  </TableContentRow>
                )
              )
            })}
          </ContentTable>
        )}
        <div className="transaction_list__pagination">
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </div>
      </TransactionListPanel>
    </Content>
  )
}
