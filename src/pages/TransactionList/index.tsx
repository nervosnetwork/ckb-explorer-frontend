import { FC } from 'react'
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
import { useIsMobile, usePaginationParamsInListPage, useSearchParams } from '../../utils/hook'
import { fetchPendingTransactions, fetchPendingTransactionsCount, fetchTransactions } from '../../service/http/fetcher'
import { Tabs } from './Tabs'
import styles from './index.module.scss'
import { QueryResult } from '../../components/QueryResult'
import { Column, Table } from './Table'
import { RouteState } from '../../routes/state'
import { assert } from '../../utils/error'

type TxStatus = 'confirmed' | 'pending'

const TransactionCardGroup: FC<{ transactions: State.Transaction[]; type: TxStatus }> = ({ transactions, type }) => {
  const itemHash: ItemCardData<State.Transaction> = {
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
  const itemCapacity: ItemCardData<State.Transaction> = {
    title: i18n.t('transaction.capacity'),
    render: transaction => (
      <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
    ),
  }

  const confirmedItems: ItemCardData<State.Transaction>[] = [
    itemHash,
    {
      title: i18n.t('transaction.height'),
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

  const pendingItems: ItemCardData<State.Transaction>[] = [
    itemHash,
    itemCapacity,
    {
      title: i18n.t('transaction.time'),
      render: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      },
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      render: transaction => <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.transactionFee))} />,
    },
  ]

  const items = type === 'confirmed' ? confirmedItems : pendingItems

  return (
    <ItemCardGroup
      cardClassName={styles.transactionCard}
      items={items}
      dataSource={transactions}
      getDataKey={transaction => transaction.transactionHash}
    />
  )
}

const TransactionTable: FC<{ transactions: State.Transaction[]; type: TxStatus }> = ({ transactions, type }) => {
  const [t] = useTranslation()

  const colHash: Column<State.Transaction> = {
    title: t('transaction.transaction_hash'),
    className: styles.colHash,
    width: '40%',
    getLinkProps: transaction => ({ to: `/transaction/${transaction.transactionHash}` }),
    render: transaction => <AddressText disableTooltip>{transaction.transactionHash}</AddressText>,
  }

  const confirmedColumns: Column<State.Transaction>[] = [
    colHash,
    {
      title: t('transaction.height'),
      width: '15%',
      getLinkProps: transaction => ({ to: `/block/${transaction.blockNumber}` }),
      render: transaction => localeNumberString(transaction.blockNumber),
    },
    {
      title: t('transaction.capacity'),
      width: '30%',
      render: transaction => (
        <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
      ),
    },
    {
      title: t('transaction.time'),
      width: '15%',
      render: transaction => parseSimpleDate(transaction.blockTimestamp),
    },
  ]

  const pendingColumns: Column<State.Transaction>[] = [
    colHash,
    {
      title: t('transaction.capacity'),
      width: '22%',
      render: transaction => (
        <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
      ),
    },
    {
      title: t('transaction.time'),
      width: '16%',
      render: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      },
    },
    {
      title: t('transaction.transaction_fee'),
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

  const query = useQuery(
    [`${type}-transactions`, type, currentPage, pageSize] as const,
    async ({ queryKey }) => {
      const [, type] = queryKey
      switch (type) {
        case 'pending': {
          const resp = await fetchPendingTransactions(currentPage, pageSize)
          return {
            transactions: resp.data,
            total: resp.meta?.total ?? 0,
          }
        }
        case 'confirmed':
        default: {
          const resp = await fetchTransactions(currentPage, pageSize)
          return {
            transactions: resp.data.map(wrapper => wrapper.attributes) ?? [],
            total: resp.meta?.total ?? 0,
          }
        }
      }
    },
    {
      keepPreviousData: true,
      initialData:
        state?.type === 'TransactionListPage' && state.createTime + stateStaleTime > Date.now()
          ? state.transactionsDataWithFirstPage
          : undefined,
    },
  )

  return (
    <QueryResult query={query}>
      {data => {
        const totalPages = Math.min(Math.ceil(data.total / pageSize), MAX_PAGE_NUMBER)
        return (
          <>
            {isMobile ? (
              <TransactionCardGroup type={type} transactions={data.transactions} />
            ) : (
              <TransactionTable type={type} transactions={data.transactions} />
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
