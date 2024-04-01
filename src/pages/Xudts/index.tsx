import { Table } from 'antd'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode } from 'react'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'
import type { XUDT } from '../../models/Xudt'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import SortButton from '../../components/SortButton'
import { TokensPanel, TokensContentEmpty, TokensLoadingPanel } from './styled'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import Loading from '../../components/Loading'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { usePaginationParamsInPage, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { FilterSortContainerOnMobile } from '../../components/FilterSortContainer'
import { Card } from '../../components/Card'
import { BooleanT } from '../../utils/array'

type SortField = 'transactions' | 'addresses_count' | 'created_time' | 'mint_status'

const TokenInfo: FC<{ token: XUDT }> = ({ token }) => {
  const { t } = useTranslation()

  const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`

  const fields: { name: string; value: ReactNode }[] = [
    {
      name: t('xudt.transactions'),
      value: localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      name: t('xudt.address_count'),
      value: localeNumberString(token.addressesCount),
    },
  ].filter(BooleanT())

  return (
    <div key={token.typeHash} className={styles.tokenInfo}>
      <div className={styles.title}>
        {token.published ? (
          <>
            <Link className={styles.link} to={`/xudt/${token.typeHash}`}>
              {symbol}
            </Link>
            {token.fullName ? <span>{token.fullName}</span> : null}
          </>
        ) : (
          symbol
        )}
      </div>
      {fields.map(field => (
        <dl key={field.name}>
          <dt>{field.name}</dt>
          <dd>{field.value}</dd>
        </dl>
      ))}
    </div>
  )
}

export function TokensCard({
  query,
  sortParam,
}: {
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}) {
  const { t } = useTranslation()

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <FilterSortContainerOnMobile>
          <span className={styles.sortOption}>
            {t('xudt.transactions')}
            <SortButton field="transactions" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('xudt.address_count')}
            <SortButton field="addresses_count" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('xudt.created_time')}
            <SortButton field="created_time" sortParam={sortParam} />
          </span>
        </FilterSortContainerOnMobile>
      </Card>

      <QueryResult
        query={query}
        errorRender={() => <TokensContentEmpty>{t('xudt.tokens_empty')}</TokensContentEmpty>}
        loadingRender={() => (
          <TokensLoadingPanel>
            <SmallLoading />
          </TokensLoadingPanel>
        )}
      >
        {data => (
          <Card className={styles.tokensCard}>
            {data?.tokens.map(token => (
              <TokenInfo key={token.typeHash} token={token} />
            ))}
          </Card>
        )}
      </QueryResult>
    </>
  )
}

const TokenTable: FC<{
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}> = ({ query, sortParam }) => {
  const { t } = useTranslation()

  const nullableColumns: (ColumnGroupType<XUDT> | ColumnType<XUDT> | false | undefined)[] = [
    {
      title: `${t('xudt.symbol')}&${t('xudt.name')}`,
      className: styles.colName,
      render: (_, token) => {
        const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
        return (
          <div className={styles.container}>
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                {token.published ? (
                  <Link className={styles.link} to={`/xudt/${token.typeHash}`}>
                    {symbol}
                    <span className={styles.name}>{token.fullName}</span>
                  </Link>
                ) : (
                  symbol
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <>
          {t('xudt.transactions')}
          <SortButton field="transactions" sortParam={sortParam} />
        </>
      ),
      className: styles.colTransactions,
      render: (_, token) => localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      title: (
        <>
          {t('xudt.address_count')}
          <SortButton field="addresses_count" sortParam={sortParam} />
        </>
      ),
      className: styles.colAddressCount,
      render: (_, token) => localeNumberString(token.addressesCount),
    },
    {
      title: (
        <>
          {t('xudt.created_time')}
          <SortButton field="created_time" sortParam={sortParam} />
        </>
      ),
      className: styles.colCreatedTime,
      render: (_, token) => parseDateNoTime(Number(token.createdAt) / 1000, false, '-'),
    },
  ]
  const columns = nullableColumns.filter(BooleanT())

  return (
    <Table
      className={styles.tokensTable}
      columns={columns}
      dataSource={query.data?.tokens ?? []}
      pagination={false}
      loading={
        query.isLoading
          ? {
              indicator: <Loading className={styles.loading} show />,
            }
          : false
      }
    />
  )
}

const Xudts = () => {
  const { t } = useTranslation()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'transactions.desc')
  const { sort } = sortParam

  const query = useQuery(['xudts', currentPage, _pageSize, sort], async () => {
    const {
      data: tokens,
      total,
      pageSize,
    } = await explorerService.api.fetchXudts(currentPage, _pageSize, sort ?? undefined)
    if (tokens.length === 0) {
      throw new Error('Tokens empty')
    }
    return {
      tokens,
      total,
      pageSize,
    }
  })
  const total = query.data?.total ?? 0
  const pageSize = query.data?.pageSize ?? _pageSize
  const totalPages = Math.ceil(total / pageSize)

  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokensTitlePanel">
          <span>{t('xudt.xudts')}</span>
        </div>

        <div className={styles.cards}>
          <TokensCard query={query} sortParam={sortParam} />
        </div>
        <div className={styles.table}>
          <TokenTable query={query} sortParam={sortParam} />
        </div>

        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </TokensPanel>
    </Content>
  )
}

export default Xudts
