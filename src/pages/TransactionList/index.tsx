import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import { TableTitleRow, TableContentRow } from '../../components/Table/styled'
import { TableTitleItem, TableContentItem } from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import i18n from '../../utils/i18n'
import Pagination from '../../components/Pagination'
import { useDispatch, useAppState } from '../../contexts/providers'
import DecimalCapacity from '../../components/DecimalCapacity'
import { getTransactions } from '../../service/app/transaction'
import ItemCard, { ItemCardData } from '../../components/Card/ItemCard'
import { TransactionCapacityPanel, TransactionListPanel, ContentTable, HighLightValue } from './styled'
import AddressText from '../../components/AddressText'
import { usePaginationParamsInListPage } from '../../utils/hook'

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
  ] as ItemCardData[]
}

export default () => {
  const dispatch = useDispatch()

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

  const { transactionsState } = useAppState()
  const { transactions = [], total } = transactionsState

  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => getTransactions(currentPage, pageSize, dispatch), [currentPage, pageSize, dispatch])

  return (
    <Content>
      <TransactionListPanel className="container">
        <div className="transaction__green__background" />
        {isMobile() ? (
          <ContentTable>
            <div className="transaction__panel">
              {transactions.map((transaction: State.Transaction) => (
                <ItemCard key={transaction.transactionHash} items={TransactionCardItems(transaction)} />
              ))}
            </div>
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
