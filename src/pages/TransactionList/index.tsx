import { FC, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import { TableTitleRow, TableContentRow } from '../../components/Table/styled'
import { TableTitleItem, TableContentItem } from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import DecimalCapacity from '../../components/DecimalCapacity'
import { ItemCardData, ItemCardGroup } from '../../components/Card/ItemCard'
import { TransactionCapacityPanel, TransactionListPanel, ContentTable, HighLightValue } from './styled'
import AddressText from '../../components/AddressText'
import { useIsMobile, usePaginationParamsInListPage } from '../../utils/hook'
import { fetchTransactions } from '../../service/http/fetcher'
import { RouteState } from '../../routes/state'

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
}

const TransactionValueItem = ({ value, to }: { value: string; to: string }) => (
  <HighLightValue>
    <Link to={to}>
      {' '}
      <span>{value}</span>
    </Link>
  </HighLightValue>
)

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
      content: (
        <AddressText disableTooltip monospace={false}>
          {transaction.transactionHash}
        </AddressText>
      ),
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

const TransactionCardGroup: FC<{ transactions: State.Transaction[] }> = ({ transactions }) => {
  const items: ItemCardData<State.Transaction>[] = [
    {
      title: i18n.t('transaction.transaction_hash'),
      render: transaction => (
        <HighLightValue>
          <AddressText
            disableTooltip
            monospace={false}
            linkProps={{
              to: `/transaction/${transaction.transactionHash}`,
            }}
          >
            {transaction.transactionHash}
          </AddressText>
        </HighLightValue>
      ),
    },
    {
      title: i18n.t('transaction.height'),
      render: transaction => (
        <TransactionValueItem
          value={localeNumberString(transaction.blockNumber)}
          to={`/block/${transaction.blockNumber}`}
        />
      ),
    },
    {
      title: i18n.t('transaction.capacity'),
      render: transaction => (
        <TransactionCapacityPanel>
          <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.capacityInvolved))} hideUnit />
        </TransactionCapacityPanel>
      ),
    },
    {
      title: i18n.t('transaction.time'),
      render: transaction => parseSimpleDate(transaction.blockTimestamp),
    },
  ]

  return (
    <ItemCardGroup
      className="transaction__panel"
      items={items}
      dataSource={transactions}
      getDataKey={transaction => transaction.transactionHash}
    />
  )
}

export default () => {
  const [t] = useTranslation()
  const TableTitles = useMemo(
    () => [
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
    ],
    [t],
  )

  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const { state } = useLocation<RouteState>()
  const stateStaleTime = 3000

  const query = useQuery(
    ['transactions', currentPage, pageSize],
    async () => {
      const resp = await fetchTransactions(currentPage, pageSize)
      return {
        transactions: resp.data.map(wrapper => wrapper.attributes) ?? [],
        total: resp.meta?.total ?? 0,
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
  const transactions = query.data?.transactions ?? []
  const totalPages = Math.ceil((query.data?.total ?? 0) / pageSize)

  return (
    <Content>
      <TransactionListPanel className="container">
        <div className="transaction__green__background" />
        {useIsMobile() ? (
          <ContentTable>
            <TransactionCardGroup transactions={transactions} />
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => (
                <TableTitleItem width={data.width} title={data.title} key={data.title} />
              ))}
            </TableTitleRow>
            {transactions.map(
              (transaction: State.Transaction) =>
                transaction && (
                  <TableContentRow key={transaction.transactionHash}>
                    {getTableContentTxList(transaction).map((data: TableContentData, index: number) => {
                      const key = index
                      return <TableContentItem width={data.width} content={data.content} to={data.to} key={key} />
                    })}
                  </TableContentRow>
                ),
            )}
          </ContentTable>
        )}
        <div className="transaction_list__pagination">
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      </TransactionListPanel>
    </Content>
  )
}
