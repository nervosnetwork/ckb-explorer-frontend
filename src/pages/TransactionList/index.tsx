import { FC, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import DecimalCapacity from '../../components/DecimalCapacity'
import { ItemCardData, ItemCardGroup } from '../../components/Card/ItemCard'
import AddressText from '../../components/AddressText'
import { useIsMobile, usePaginationParamsInListPage, useSearchParams, useSortParam } from '../../utils/hook'
import { fetchPendingTransactions, fetchPendingTransactionsCount, fetchTransactions } from '../../service/http/fetcher'
import { Tabs } from './Tabs'
import styles from './index.module.scss'
import { QueryResult } from '../../components/QueryResult'
import { Column, Table } from './Table'
import { RouteState } from '../../routes/state'
import { assert } from '../../utils/error'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { TableTitleRowItem } from '../../components/Table/styled'

type TxStatus = 'confirmed' | 'pending'

type ConfirmedSortByType = 'height' | 'capacity'
type PendingSortByType = 'capacity' | 'time' | 'fee'

interface SortItemCardData<T> extends ItemCardData<T> {
  sortRule?: ConfirmedSortByType | PendingSortByType
}

const TransactionCardGroup: FC<{
  transactions: State.Transaction[]
  type: TxStatus
  sortButton: (sortRule?: ConfirmedSortByType | PendingSortByType) => ReactNode
}> = ({ transactions, type, sortButton }) => {
  const itemHash: SortItemCardData<State.Transaction> = {
    title: i18n.t('transaction.transaction_hash'),
    render: transaction => (
      <AddressText
        disableTooltip
        monospace={false}
        linkProps={{
          className: styles.addressLink,
          to: `/transaction/${transaction.transactionHash}`,
        }}
      >
        {transaction.transactionHash}
      </AddressText>
    ),
  }
  const itemCapacity: SortItemCardData<State.Transaction> = {
    title: i18n.t('transaction.capacity'),
    sortRule: 'capacity',
    render: transaction => (
      <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
    ),
  }

  const confirmedItems: SortItemCardData<State.Transaction>[] = [
    itemHash,
    {
      title: i18n.t('transaction.height'),
      sortRule: 'height',
      render: transaction => (
        <Link to={`/block/${transaction.blockNumber}`}>
          <span>{localeNumberString(transaction.blockNumber)}</span>
        </Link>
      ),
    },
    itemCapacity,
    {
      title: i18n.t('transaction.time'),
      render: transaction => parseSimpleDate(transaction.blockTimestamp),
    },
  ]

  const pendingItems: SortItemCardData<State.Transaction>[] = [
    itemHash,
    itemCapacity,
    {
      title: i18n.t('transaction.time'),
      sortRule: 'time',
      render: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      },
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      sortRule: 'fee',
      render: transaction => <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.transactionFee))} />,
    },
  ]

  const items = type === 'confirmed' ? confirmedItems : pendingItems

  return (
    <>
      <div className={styles.transactionCardHeader}>
        {items
          .filter(data => data.sortRule)
          .map((data: SortItemCardData<State.Transaction>) => (
            <TableTitleRowItem width="fit-content" key={data.title}>
              <div>{data.title}</div>
              {sortButton(data.sortRule)}
            </TableTitleRowItem>
          ))}
      </div>
      <ItemCardGroup
        cardClassName={styles.transactionCard}
        items={items}
        dataSource={transactions}
        getDataKey={transaction => transaction.transactionHash}
      />
    </>
  )
}

const TransactionTable: FC<{
  transactions: State.Transaction[]
  type: TxStatus
  sortButton: (sortRule: ConfirmedSortByType | PendingSortByType) => ReactNode
}> = ({ transactions, type, sortButton }) => {
  const [t] = useTranslation()

  const colHash: Column<State.Transaction> = {
    key: 'hash',
    title: t('transaction.transaction_hash'),
    className: styles.colHash,
    width: '40%',
    getLinkProps: transaction => ({ to: `/transaction/${transaction.transactionHash}` }),
    render: transaction => <AddressText disableTooltip>{transaction.transactionHash}</AddressText>,
  }

  const confirmedColumns: Column<State.Transaction>[] = [
    colHash,
    {
      key: 'height',
      title: (
        <>
          <div>{t('transaction.height')}</div>
          {sortButton('height')}
        </>
      ),
      width: '15%',
      getLinkProps: transaction => ({ to: `/block/${transaction.blockNumber}` }),
      render: transaction => localeNumberString(transaction.blockNumber),
    },
    {
      key: 'capacity',
      title: (
        <>
          <div>{t('transaction.capacity')}</div>
          {sortButton('capacity')}
        </>
      ),
      width: '30%',
      render: transaction => (
        <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
      ),
    },
    {
      key: 'time',
      title: t('transaction.time'),
      width: '15%',
      render: transaction => parseSimpleDate(transaction.blockTimestamp),
    },
  ]

  const pendingColumns: Column<State.Transaction>[] = [
    colHash,
    {
      key: 'capacity',
      title: (
        <>
          <div>{t('transaction.capacity')}</div>
          {sortButton('capacity')}
        </>
      ),
      width: '22%',
      render: transaction => (
        <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
      ),
    },
    {
      key: 'time',
      title: (
        <>
          <div>{t('transaction.time')}</div>
          {sortButton('time')}
        </>
      ),
      width: '16%',
      render: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      },
    },
    {
      key: 'fee',
      title: (
        <>
          <div>{t('transaction.transaction_fee')}</div>
          {sortButton('fee')}
        </>
      ),
      width: '22%',
      render: transaction => <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.transactionFee))} />,
    },
  ]

  const columns = type === 'confirmed' ? confirmedColumns : pendingColumns

  return (
    <Table
      className={styles.transactionTable}
      columns={columns}
      dataSource={transactions}
      getRowKey={transaction => transaction.transactionHash}
    />
  )
}

const TransactionsPanel: FC<{ type: TxStatus }> = ({ type }) => {
  const isMobile = useIsMobile()
  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const { state } = useLocation<RouteState>()
  const stateStaleTime = 3000
  const MAX_PAGE_NUMBER = 5000

  const { sortBy, orderBy, sort, handleSortClick } = useSortParam<ConfirmedSortByType | PendingSortByType>(s =>
    type === 'confirmed' ? s === 'height' || s === 'capacity' : s === 'capacity' || s === 'time' || s === 'fee',
  )

  const query = useQuery(
    [`${type}-transactions`, type, currentPage, pageSize, sortBy, orderBy] as const,
    async ({ queryKey }) => {
      const [, type] = queryKey
      switch (type) {
        case 'pending': {
          const resp = await fetchPendingTransactions(currentPage, pageSize, sort)
          return {
            transactions: resp.data,
            total: resp.meta?.total ?? 0,
          }
        }
        case 'confirmed':
        default: {
          const resp = await fetchTransactions(currentPage, pageSize, sort)
          return {
            transactions: resp.data.map(wrapper => wrapper.attributes) ?? [],
            total: resp.meta?.total ?? 0,
          }
        }
      }
    },
    {
      initialData:
        state?.type === 'TransactionListPage' && state.createTime + stateStaleTime > Date.now()
          ? state.transactionsDataWithFirstPage
          : undefined,
    },
  )

  const sortButton = (sortRule?: ConfirmedSortByType | PendingSortByType) => (
    <button
      type="button"
      className={styles.sortIcon}
      data-order={sortRule === sortBy ? orderBy : undefined}
      onClick={() => handleSortClick(sortRule)}
    >
      <SortIcon />
    </button>
  )

  return (
    <QueryResult query={query}>
      {data => {
        const totalPages = Math.min(Math.ceil(data.total / pageSize), MAX_PAGE_NUMBER)
        return (
          <>
            {isMobile ? (
              <TransactionCardGroup type={type} transactions={data.transactions} sortButton={sortButton} />
            ) : (
              <TransactionTable type={type} transactions={data.transactions} sortButton={sortButton} />
            )}

            <Pagination
              className={styles.pagination}
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setPage}
              annotation={
                totalPages === MAX_PAGE_NUMBER
                  ? i18n.t('pagination.only_first_pages_visible', { pages: MAX_PAGE_NUMBER })
                  : undefined
              }
            />
          </>
        )
      }}
    </QueryResult>
  )
}

export default () => {
  const { tab } = useSearchParams('tab')

  const { data } = useQuery(['transactions-count'], fetchPendingTransactionsCount)

  return (
    <Content>
      <div className="container">
        <Tabs
          activeKey={tab}
          getItemLink={key => `/transaction/list?tab=${key}`}
          items={[
            {
              label: 'Transactions',
              key: 'confirmed',
              // Use different keys on the components to ensure that they do not
              // reuse useQuery with keepPreviousData option from each other
              children: <TransactionsPanel key="confirmed" type="confirmed" />,
            },
            {
              label: `Pending Transactions${data == null ? '' : `(${data.toLocaleString('en')})`}`,
              key: 'pending',
              children: <TransactionsPanel key="pending" type="pending" />,
            },
          ]}
        />
      </div>
    </Content>
  )
}
